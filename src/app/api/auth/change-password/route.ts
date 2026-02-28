import { NextRequest, NextResponse } from 'next/server';
import { changePasswordSchema } from '@/lib/utils/validators';
import { authService } from '@/lib/services/auth';
import { verifyAuth } from '@/lib/middleware/auth';

export async function PUT(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    const userId = authResult.user_id;

    const body = await request.json();
    
    // Validate input
    const validationResult = changePasswordSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', data: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = validationResult.data;

    // Change password
    await authService.changePassword(
      userId,
      currentPassword,
      newPassword
    );

    return NextResponse.json(
      { success: true, data: { message: 'Password changed successfully' } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
