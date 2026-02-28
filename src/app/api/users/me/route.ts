import { NextRequest, NextResponse } from 'next/server';
import { updateDisplayNameSchema } from '@/lib/utils/validators';
import { userRepo } from '@/lib/repositories';
import { verifyAuth } from '@/lib/middleware/auth';
import { cacheManager } from '@/lib/cache';

export async function PUT(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    const userId = authResult.user_id;

    const body = await request.json();
    
    // Validate input
    const validationResult = updateDisplayNameSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', data: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { display_name } = validationResult.data;

    // Update user
    const updatedUser = await userRepo.update(userId, {
      display_name
    });

    // Invalidate cache
    cacheManager.del(`user:${userId}`);
    cacheManager.del(`user:email:${authResult.email}`);

    return NextResponse.json(
      { success: true, data: { user: updatedUser } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
