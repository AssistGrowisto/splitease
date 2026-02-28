import { NextRequest, NextResponse } from 'next/server';
import { updateExpenseSchema } from '@/lib/utils/validators';
import { groupMemberRepo, groupRepo, expenseRepo, expensePayerRepo, expenseSplitRepo, activityLogRepo, userRepo } from '@/lib/repositories';
import { verifyAuth } from '@/lib/middleware/auth';
import { emailService } from '@/lib/services/email';
import { cacheManager } from '@/lib/cache';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; expId: string } }
) {
  try {
    const authResult = await verifyAuth(request);
    const groupId = params.id;
    const expenseId = params.expId;
    const userId = authResult.user_id;

    // Verify membership
    const membership = await groupMemberRepo.findByGroupAndUser(groupId, userId);
    if (!membership) {
      return NextResponse.json(
        { success: false, error: 'Not a member of this group' },
        { status: 403 }
      );
    }

    // Get expense
    const expense = await expenseRepo.findById(expenseId);
    if (!expense || expense.group_id !== groupId) {
      return NextResponse.json(
        { success: false, error: 'Expense not found' },
        { status: 404 }
      );
    }

    // Get payers and splits
    const payers = await expensePayerRepo.findByExpenseId(expenseId);
    const splits = await expenseSplitRepo.findByExpenseId(expenseId);

    // Get activity log
    const activities = await activityLogRepo.findByExpenseId(expenseId);

    return NextResponse.json(
      { success: true, data: { expense, payers, splits, activities } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get expense error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; expId: string } }
) {
  try {
    const authResult = await verifyAuth(request);
    const groupId = params.id;
    const expenseId = params.expId;
    const userId = authResult.user_id;

    // Get expense
    const expense = await expenseRepo.findById(expenseId);
    if (!expense || expense.group_id !== groupId) {
      return NextResponse.json(
        { success: false, error: 'Expense not found' },
        { status: 404 }
      );
    }

    // Verify expense creator
    if (expense.created_by !== userId) {
      return NextResponse.json(
        { success: false, error: 'Only expense creator can update' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validationResult = updateExpenseSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', data: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { description, total_amount: amount, payers, splits } = validationResult.data;

    // Update expense
    const updatedExpense = await expenseRepo.update(expenseId, {
      description,
      total_amount: amount
    });

    if (!updatedExpense) {
      return NextResponse.json(
        { success: false, error: 'Failed to update expense' },
        { status: 500 }
      );
    }

    // Delete old payers and splits
    await expensePayerRepo.deleteByExpenseId(expenseId);
    await expenseSplitRepo.deleteByExpenseId(expenseId);

    // Create new payers and splits
    if (payers) {
      const payerEntries = payers.map(p => ({
        expense_id: expenseId,
        user_id: p.user_id,
        amount_paid: p.amount_paid
      }));
      await expensePayerRepo.createMany(payerEntries);
    }

    if (splits) {
      const splitEntries = splits.map(s => ({
        expense_id: expenseId,
        user_id: s.user_id,
        split_amount: s.split_amount || 0,
        split_percentage: s.split_percentage || 0
      }));
      await expenseSplitRepo.createMany(splitEntries);
    }

    // Log activity
    await activityLogRepo.create({
      group_id: groupId,
      user_id: userId,
      expense_id: expenseId,
      action: 'edited',
      details: { description, amount },
      timestamp: new Date().toISOString()
    });

    // Send email to group members
    const group = await groupRepo.findById(groupId);
    if (group) {
      const groupMembers = await groupMemberRepo.findByGroupId(groupId);
      const members = await Promise.all(
        groupMembers.map(gm => userRepo.findById(gm.user_id))
      );

      try {
        const memberEmails = members
          .filter(m => m && m.user_id !== userId)
          .map(m => m!.email);
        
        if (memberEmails.length > 0) {
          await emailService.sendExpenseEdited(group, updatedExpense, memberEmails);
        }
      } catch (error) {
        console.error('Error sending update emails:', error);
      }
    }

    // Invalidate cache
    cacheManager.del(`expenses:group:${groupId}`);
    cacheManager.del(`expense:${expenseId}`);

    return NextResponse.json(
      { success: true, data: { expense: updatedExpense } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update expense error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; expId: string } }
) {
  try {
    const authResult = await verifyAuth(request);
    const groupId = params.id;
    const expenseId = params.expId;
    const userId = authResult.user_id;

    // Get expense
    const expense = await expenseRepo.findById(expenseId);
    if (!expense || expense.group_id !== groupId) {
      return NextResponse.json(
        { success: false, error: 'Expense not found' },
        { status: 404 }
      );
    }

    // Verify expense creator
    if (expense.created_by !== userId) {
      return NextResponse.json(
        { success: false, error: 'Only expense creator can delete' },
        { status: 403 }
      );
    }

    // Soft delete
    await expenseRepo.softDelete(expenseId);

    // Log activity
    await activityLogRepo.create({
      group_id: groupId,
      user_id: userId,
      expense_id: expenseId,
      action: 'deleted',
      details: { description: expense.description },
      timestamp: new Date().toISOString()
    });

    // Send email to group members
    const group = await groupRepo.findById(groupId);
    if (group) {
      const groupMembers = await groupMemberRepo.findByGroupId(groupId);
      const members = await Promise.all(
        groupMembers.map(gm => userRepo.findById(gm.user_id))
      );

      try {
        const memberEmails = members
          .filter(m => m && m.user_id !== userId)
          .map(m => m!.email);
        
        if (memberEmails.length > 0) {
          await emailService.sendExpenseDeleted(group, expense, memberEmails);
        }
      } catch (error) {
        console.error('Error sending delete emails:', error);
      }
    }

    // Invalidate cache
    cacheManager.del(`expenses:group:${groupId}`);
    cacheManager.del(`expense:${expenseId}`);

    return NextResponse.json(
      { success: true, data: { message: 'Expense deleted' } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete expense error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
