import { NextRequest, NextResponse } from 'next/server';
import { settleSchema } from '@/lib/utils/validators';
import { groupMemberRepo, groupRepo, expenseRepo, expensePayerRepo, expenseSplitRepo, activityLogRepo, userRepo } from '@/lib/repositories';
import { verifyAuth } from '@/lib/middleware/auth';
import { emailService } from '@/lib/services/email';
import { cacheManager } from '@/lib/cache';

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
    const validationResult = settleSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', data: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { to_user_id, amount } = validationResult.data;

    const now = new Date().toISOString();

    // Get group currency
    const group = await groupRepo.findById(groupId);
    const currency = group?.base_currency || 'INR';

    // Create settlement expense
    const settlement = await expenseRepo.create({
      group_id: groupId,
      description: 'Settlement payment',
      total_amount: amount,
      currency: currency,
      split_type: 'equal',
      expense_date: now,
      created_by: userId,
      receipt_url: null,
      is_settlement: true,
      status: 'active',
      converted_amount: amount,
      conversion_rate: 1,
      created_at: now,
      updated_at: now
    });

    // Create payer entry (current user paid)
    await expensePayerRepo.createMany([{
      expense_id: settlement.expense_id,
      user_id: userId,
      amount_paid: amount
    }]);

    // Create split entry (to_user receives)
    await expenseSplitRepo.createMany([{
      expense_id: settlement.expense_id,
      user_id: to_user_id,
      split_amount: amount,
      split_percentage: 0
    }]);

    // Log activity
    await activityLogRepo.create({
      group_id: groupId,
      user_id: userId,
      expense_id: settlement.expense_id,
      action: 'settled',
      details: { to_user_id, amount },
      timestamp: now
    });

    // Send email to recipient
    try {
      const recipient = await userRepo.findById(to_user_id);
      const sender = await userRepo.findById(userId);
      if (recipient && sender && group) {
        await emailService.sendSettlementRecorded(group, sender, recipient, amount);
      }
    } catch (error) {
      console.error('Error sending settlement email:', error);
    }

    // Invalidate cache
    cacheManager.del(`expenses:group:${groupId}`);
    cacheManager.del(`balances:group:${groupId}`);

    return NextResponse.json(
      { success: true, data: { settlement } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create settlement error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
