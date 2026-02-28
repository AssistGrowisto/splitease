import { NextRequest, NextResponse } from 'next/server';
import { groupMemberRepo, expenseRepo, expensePayerRepo, expenseSplitRepo, userRepo } from '@/lib/repositories';
import { verifyAuth } from '@/lib/middleware/auth';
import { simplifyDebts } from '@/lib/utils/helpers';

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

    // Fetch group info for currency
    const members = await groupMemberRepo.findByGroupId(groupId);

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
        const amountPaid = typeof payer.amount_paid === 'number'
          ? payer.amount_paid
          : parseFloat(String(payer.amount_paid)) || 0;
        balances[payer.user_id] += amountPaid;
      }

      for (const split of splits) {
        if (!balances[split.user_id]) {
          balances[split.user_id] = 0;
        }
        const splitAmount = typeof split.split_amount === 'number'
          ? split.split_amount
          : parseFloat(String(split.split_amount)) || 0;
        balances[split.user_id] -= splitAmount;
      }
    }

    // Simplify debts
    const simplifiedTransactions = simplifyDebts(balances);

    // Enrich with user display names and group currency
    const userCache: Record<string, string> = {};
    for (const member of members) {
      const user = await userRepo.findById(member.user_id);
      if (user) {
        userCache[member.user_id] = user.display_name || user.email || member.user_id;
      }
    }

    // Get group base currency
    const { groupRepo } = await import('@/lib/repositories');
    const group = await groupRepo.findById(groupId);
    const currency = group?.base_currency || 'INR';

    const enrichedDebts = simplifiedTransactions.map((tx, index) => ({
      id: `debt_${index}`,
      from_user_id: tx.from_user_id,
      to_user_id: tx.to_user_id,
      amount: tx.amount,
      currency: currency,
      from_user_name: userCache[tx.from_user_id] || tx.from_user_id,
      to_user_name: userCache[tx.to_user_id] || tx.to_user_id,
    }));

    return NextResponse.json(
      { success: true, data: { debts: enrichedDebts } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get simplified balances error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
