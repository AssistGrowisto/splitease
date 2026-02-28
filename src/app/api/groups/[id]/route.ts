import { NextRequest, NextResponse } from 'next/server';
import { updateGroupSchema } from '@/lib/utils/validators';
import { groupRepo, groupMemberRepo, expenseRepo, expensePayerRepo, expenseSplitRepo, userRepo } from '@/lib/repositories';
import { verifyAuth } from '@/lib/middleware/auth';
import { cacheManager } from '@/lib/cache';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAuth(request);
    const userId = authResult.user_id;
    const groupId = params.id;

    // Verify membership
    const membership = await groupMemberRepo.findByGroupAndUser(groupId, userId);
    if (!membership) {
      return NextResponse.json(
        { success: false, error: 'Not a member of this group' },
        { status: 403 }
      );
    }

    // Get group details
    const group = await groupRepo.findById(groupId);
    if (!group) {
      return NextResponse.json(
        { success: false, error: 'Group not found' },
        { status: 404 }
      );
    }

    // Get group members and enrich with user details
    const rawMembers = await groupMemberRepo.findByGroupId(groupId);
    const members = await Promise.all(
      rawMembers.map(async (gm) => {
        const user = await userRepo.findById(gm.user_id);
        return {
          id: gm.user_id,
          user_id: gm.user_id,
          display_name: user?.display_name || gm.user_id,
          email: user?.email || '',
          role: gm.role,
          status: gm.status,
          joined_at: gm.joined_at
        };
      })
    );

    return NextResponse.json(
      { success: true, data: { group, members } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get group error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAuth(request);
    const userId = authResult.user_id;
    const groupId = params.id;

    // Verify creator role
    const membership = await groupMemberRepo.findByGroupAndUser(groupId, userId);
    if (!membership || membership.role !== 'creator') {
      return NextResponse.json(
        { success: false, error: 'Only group creator can update group' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validationResult = updateGroupSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', data: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { group_name } = validationResult.data;

    // Update group
    const updatedGroup = await groupRepo.update(groupId, {
      group_name
    });

    // Invalidate cache
    cacheManager.del(`group:${groupId}`);

    return NextResponse.json(
      { success: true, data: { group: updatedGroup } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update group error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAuth(request);
    const userId = authResult.user_id;
    const groupId = params.id;

    // Verify creator role
    const membership = await groupMemberRepo.findByGroupAndUser(groupId, userId);
    if (!membership || membership.role !== 'creator') {
      return NextResponse.json(
        { success: false, error: 'Only group creator can delete group' },
        { status: 403 }
      );
    }

    // Check all balances are zero
    const expenses = await expenseRepo.findByGroupId(groupId);
    
    for (const expense of expenses) {
      const payers = await expensePayerRepo.findByExpenseId(expense.expense_id);
      const splits = await expenseSplitRepo.findByExpenseId(expense.expense_id);

      for (const payer of payers) {
        const userShare = splits
          .filter(s => s.user_id === payer.user_id)
          .reduce((sum, s) => sum + s.split_amount, 0);

        if (payer.amount_paid !== userShare) {
          return NextResponse.json(
            { success: false, error: 'Cannot delete group with outstanding balances' },
            { status: 409 }
          );
        }
      }
    }

    // Archive group
    await groupRepo.update(groupId, { status: 'archived' });

    // Invalidate cache
    cacheManager.del(`group:${groupId}`);
    cacheManager.del(`groups:user:${userId}`);

    return NextResponse.json(
      { success: true, data: { message: 'Group archived' } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete group error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
