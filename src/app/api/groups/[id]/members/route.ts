import { NextRequest, NextResponse } from 'next/server';
import { addMemberSchema } from '@/lib/utils/validators';
import { groupMemberRepo, userRepo, groupRepo } from '@/lib/repositories';
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

    // Verify creator role
    const membership = await groupMemberRepo.findByGroupAndUser(groupId, userId);
    if (!membership || membership.role !== 'creator') {
      return NextResponse.json(
        { success: false, error: 'Only group creator can add members' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validationResult = addMemberSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', data: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    // Check user is registered
    const newMember = await userRepo.findByEmail(email);
    if (!newMember) {
      return NextResponse.json(
        { success: false, error: 'User not registered' },
        { status: 404 }
      );
    }

    // Check not already member
    const existingMember = await groupMemberRepo.findByGroupAndUser(groupId, newMember.user_id);
    if (existingMember) {
      return NextResponse.json(
        { success: false, error: 'User is already a member' },
        { status: 409 }
      );
    }

    // Check max 15 members
    const currentMembers = await groupMemberRepo.findByGroupId(groupId);
    if (currentMembers.length >= 15) {
      return NextResponse.json(
        { success: false, error: 'Group has reached maximum member limit (15)' },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();

    // Add member
    const addedMember = await groupMemberRepo.create({
      group_id: groupId,
      user_id: newMember.user_id,
      role: 'member',
      status: 'active',
      joined_at: now,
      removed_at: null
    });

    // Send email notification
    try {
      const group = await groupRepo.findById(groupId);
      if (group) {
        await emailService.sendAddedToGroup(group, email);
      }
    } catch (error) {
      console.error(`Error sending invite email to ${email}:`, error);
    }

    // Invalidate cache
    cacheManager.del(`group:members:${groupId}`);

    return NextResponse.json(
      { success: true, data: { member: addedMember } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Add member error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
