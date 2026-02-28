import { NextRequest, NextResponse } from 'next/server';
import { groupMemberRepo, expenseRepo, expensePayerRepo, expenseSplitRepo } from '@/lib/repositories';
import { verifyAuth } from '@/lib/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    const userId = authResult.user_id;

    // Fetch all user's groups
    const groupMembers = await groupMemberRepo.findByUserId(userId);

    let totalOwed = 0;
    let totalToReceive = 0;

    // For each active group, calculate net balance
    for (const groupMember of groupMembers) {
      const groupId = groupMember.group_id;

      // Fetch all active expenses in the group
      const expenses = await expenseRepo.findByGroupId(groupId);

      for (const expense of expenses) {
        // Get payers for this expense
        const expensePayers = await expensePayerRepo.findByExpenseId(expense.expense_id);
        
        // Get splits for this expense
        const expenseSplits = await expenseSplitRepo.findByExpenseId(expense.expense_id);

        // Calculate user's balance for this expense
        const userPaid = expensePayers
          .filter(p => p.user_id === userId)
          .reduce((sum, p) => sum + p.amount_paid, 0);

        const userShare = expenseSplits
          .filter(s => s.user_id === userId)
          .reduce((sum, s) => sum + s.split_amount, 0);

        const balance = userPaid - userShare;

        if (balance > 0) {
          totalToReceive += balance;
        } else if (balance < 0) {
          totalOwed += Math.abs(balance);
        }
      }
    }

    return NextResponse.json(
      { 
        success: true, 
        data: { 
          total_owed: totalOwed,
          total_to_receive: totalToReceive
        } 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get user summary error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
