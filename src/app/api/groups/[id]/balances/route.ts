import { NextRequest, NextResponse } from 'next/server';
import { groupMemberRepo, expenseRepo, expensePayerRepo, expenseSplitRepo } from '@/lib/repositories';
import { verifyAuth } from '@/lib/middleware/auth';

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

    // Fetch all active expenses with payers/splits
    const expenses = await expenseRepo.findByGroupId(groupId);
    
    // Calculate net balance per member
    const balances: Record<string, number> = {};

    for (const expense of expenses) {
      const payers = await expensePayerRepo.findByExpenseId(expense.expense_id);
      const splits = await expenseSplitRepo.findByExpenseId(expense.expense_id);

      for (const payer of payers) {
        if (!balances[payer.user_id]) {
          balances[payer.user_id] = 0;
        }
        balances[payer.user_id] += payer.amount_paid;
      }

      for (const split of splits) {
        if (!balances[split.user_id]) {
          balances[split.user_id] = 0;
        }
        balances[split.user_id] -= split.split_amount;
      }
    }

    // Calculate total spending
    const totalSpending = Object.values(balances).reduce((sum, val) => sum + Math.abs(val), 0) / 2;

    return NextResponse.json(
      { 
        success: true, 
        data: { 
          balances,
          total_spending: totalSpending
        } 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get balances error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
