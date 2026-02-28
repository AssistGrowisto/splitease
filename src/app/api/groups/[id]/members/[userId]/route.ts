import { NextRequest, NextResponse } from 'next/server';
import { groupMemberRepo, expenseRepo, expensePayerRepo, expenseSplitRepo, userRepo, groupRepo } from '@/lib/repositories';
import { verifyAuth } from '@/lib/middleware/auth';
import { emailService } from '@/lib/services/email';
import { cacheManager } from '@/lib/cache';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; userId: string } }
) {
  try {
    const authResult = await verifyAuth(request);
    const groupId = params.id;
    const memberUserId = params.userId;
    const creatorId = authResult.user_id;

    // Verify creator role
    const creatorMembership = await groupMemberRepo.findByGroupAndUser(groupId, creatorId);
    if (!creatorMembership || creatorMembership.role !== 'creator') {
      return NextResponse.json(
        { success: false, error: 'Only group creator can remove members' },
        { status: 403 }
      );
    }

    // Get member to check balance
    const member = await groupMemberRepo.findByGroupAndUser(groupId, memberUserId);
    if (!member) {
      return NextResponse.json(
        { success: false, error: 'Member not found' },
        { status: 404 }
      );
    }

    // Check member balance is zero
    const expenses = await expenseRepo.findByGroupId(groupId);
    
    for (const expense of expenses) {
      const payers = await expensePayerRepo.findByExpenseId(expense.expense_id);
      const splits = await expenseSplitRepo.findByExpenseId(expense.expense_id);

      const memberPaid = payers
        .filter(p => p.user_id === memberUserId)
        .reduce((sum, p) => sum + p.amount_paid, 0);

      const memberShare = splits
        .filter(s => s.user_id === memberUserId)
        .reduce((sum, s) => sum + s.split_amount, 0);

      if (memberPaid !== memberShare) {
        return NextResponse.json(
          { success: false, error: 'Cannot remove member with outstanding balance' },
          { status: 409 }
        );
      }
    }

    // Remove member
    await groupMemberRepo.remove(member.membership_id);

    // Send email notification
    try {
      const memberUser = await userRepo.findById(memberUserId);
      const group = await groupRepo.findById(groupId);
      if (memberUser && group) {
        await emailService.sendRemovedFromGroup(group, memberUser.email);
      }
    } catch (error) {
      console.error('Error sending removal email:', error);
    }

    // Invalidate cache
    cacheManager.del(`group:members:${groupId}`);

    return NextResponse.json(
      { success: true, data: { message: 'Member removed' } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Remove member error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
