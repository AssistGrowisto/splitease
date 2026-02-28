import { NextRequest, NextResponse } from 'next/server';
import { forgotPasswordSchema } from '@/lib/utils/validators';
import { authService } from '@/lib/services/auth';
import { emailService } from '@/lib/services/email';
import { userRepo } from '@/lib/repositories';
import { rateLimiter } from '@/lib/middleware/rate-limiter';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate email
    const validationResult = forgotPasswordSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', data: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    // Rate limit: 3/hour per email
    const key = `forgot-password:${email}`;
    const allowed = rateLimiter.check(key, 3, 3600000); // 3600000ms = 1 hour
    
    if (!allowed) {
      // Return success even when rate limited for security
      return NextResponse.json(
        { success: true, data: { message: 'If an account exists with this email, a password reset link has been sent.' } },
        { status: 200 }
      );
    }

    // Check if user exists
    const user = await userRepo.findByEmail(email);
    
    // Always return success message for security (don't reveal if email exists)
    if (user) {
      try {
        const tempPassword = await authService.forgotPassword(email);
        await emailService.sendForgotPassword(email, tempPassword);
      } catch (error) {
        console.error('Error sending forgot password email:', error);
      }
    }

    return NextResponse.json(
      { success: true, data: { message: 'If an account exists with this email, a password reset link has been sent.' } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
