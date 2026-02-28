import { NextRequest, NextResponse } from 'next/server';
import { createGroupSchema } from '@/lib/utils/validators';
import { groupRepo, groupMemberRepo, userRepo } from '@/lib/repositories';
import { verifyAuth } from '@/lib/middleware/auth';
import { cacheManager } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    const url = new URL(request.url);
    const status = url.searchParams.get('status') as 'active' | 'archived' | undefined;
    const userId = authResult.user_id;

    // Fetch user's group memberships
    const groupMembers = await groupMemberRepo.findByUserId(userId);

    // Fetch group details for each membership
    const groups = await Promise.all(
      groupMembers.map(gm => groupRepo.findById(gm.group_id))
    );

    const filteredGroups = groups.filter(g => g !== null && (!status || g.status === status));

    return NextResponse.json(
      { success: true, data: { groups: filteredGroups } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get groups error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    const body = await request.json();
    
    // Validate input
    const validationResult = createGroupSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', data: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { group_name, base_currency } = validationResult.data;
    const creatorId = authResult.user_id;

    const now = new Date().toISOString();

    // Create group (without group_id - it's auto-generated)
    const group = await groupRepo.create({
      group_name: group_name,
      created_by: creatorId,
      base_currency: base_currency || 'USD',
      status: 'active',
      created_at: now,
      updated_at: now
    });

    // Add creator as member with role='creator'
    await groupMemberRepo.create({
      group_id: group.group_id,
      user_id: creatorId,
      role: 'creator',
      status: 'active',
      joined_at: now,
      removed_at: null
    });

    // Invalidate cache
    cacheManager.del(`groups:user:${creatorId}`);

    return NextResponse.json(
      { success: true, data: { group } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create group error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
