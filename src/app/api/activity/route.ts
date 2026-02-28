import { NextRequest, NextResponse } from 'next/server';
import { groupMemberRepo, activityLogRepo, groupRepo, userRepo } from '@/lib/repositories';
import { verifyAuth } from '@/lib/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    const userId = authResult.user_id;

    // Fetch user's group memberships
    const groupMembers = await groupMemberRepo.findByUserId(userId);
    const groupIds = groupMembers.map(gm => gm.group_id);

    if (groupIds.length === 0) {
      return NextResponse.json(
        { success: true, data: { activities: [] } },
        { status: 200 }
      );
    }

    // Fetch recent activity across those groups
    const activities = await activityLogRepo.findByUserGroups(userId, groupIds);

    // Enrich with group names and user display names
    const enrichedActivities = await Promise.all(
      activities.map(async (activity) => {
        const group = await groupRepo.findById(activity.group_id);
        const user = await userRepo.findById(activity.user_id);
        
        return {
          ...activity,
          group_name: group?.group_name || 'Unknown Group',
          user_display_name: user?.display_name || 'Unknown User'
        };
      })
    );

    // Sort reverse-chronological (newest first)
    enrichedActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json(
      { success: true, data: { activities: enrichedActivities } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get activity error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
