import { NextRequest, NextResponse } from 'next/server';
import { createExpenseSchema } from '@/lib/utils/validators';
import { groupMemberRepo, groupRepo, expenseRepo, expensePayerRepo, expenseSplitRepo, activityLogRepo, userRepo } from '@/lib/repositories';
import { verifyAuth } from '@/lib/middleware/auth';
import { emailService } from '@/lib/services/email';
import { cacheManager } from '@/lib/cache';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAuth(request);
    const groupId = params.id;
    const userId = authResult.user_id;

    // Verify membership
    const membership = await groupMemberRepo.findByGroupAndUser(groupId, userId);
    if (!membership) {
      return NextResponse.json(
        { success: false, error: 'Not a member of this group' },
        { status: 403 }
      );
    }

    // Fetch active expenses for group
    const expenses = await expenseRepo.findByGroupId(groupId);

    // Enrich with payer and split details
    const enrichedExpenses = await Promise.all(
      expenses.map(async (expense) => {
        const payers = await expensePayerRepo.findByExpenseId(expense.expense_id);
        const splits = await expenseSplitRepo.findByExpenseId(expense.expense_id);
        return { ...expense, payers, splits };
      })
    );

    return NextResponse.json(
      { success: true, data: { expenses: enrichedExpenses } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get expenses error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAuth(request);
    const groupId = params.id;
    const userId = authResult.user_id;

    // Verify membership
    const membership = await groupMemberRepo.findByGroupAndUser(groupId, userId);
    if (!membership) {
      return NextResponse.json(
        { success: false, error: 'Not a member of this group' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validationResult = createExpenseSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', data: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { description, total_amount: amount, currency, payers, splits, split_type, expense_date } = validationResult.data;

    const now = new Date().toISOString();

    // Create expense
    const expense = await expenseRepo.create({
      group_id: groupId,
      description,
      total_amount: amount,
      currency: currency,
      split_type,
      expense_date,
      created_by: userId,
      receipt_url: null,
      is_settlement: false,
      status: 'active',
      converted_amount: amount,
      conversion_rate: 1,
      created_at: now,
      updated_at: now
    });

    // Create payers
    const payerEntries = payers.map(p => ({
      expense_id: expense.expense_id,
      user_id: p.user_id,
      amount_paid: p.amount_paid
    }));
    await expensePayerRepo.createMany(payerEntries);

    // Create splits
    const splitEntries = splits.map(s => ({
      expense_id: expense.expense_id,
      user_id: s.user_id,
      split_amount: s.split_amount,
      split_percentage: s.split_percentage || 0
    }));
    await expenseSplitRepo.createMany(splitEntries);

    // Log activity
    await activityLogRepo.create({
      group_id: groupId,
      user_id: userId,
      expense_id: expense.expense_id,
      action: 'created',
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
          await emailService.sendExpenseAdded(group, expense, memberEmails);
        }
      } catch (error) {
        console.error('Error sending expense emails:', error);
      }
    }

    // Invalidate cache
    cacheManager.del(`expenses:group:${groupId}`);

    return NextResponse.json(
      { success: true, data: { expense } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create expense error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
