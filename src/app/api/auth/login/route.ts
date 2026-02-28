import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/utils/validators';
import { authService } from '@/lib/services/auth';
import { rateLimiter } from '@/lib/middleware/rate-limiter';

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 10/15min per IP
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const key = `login:${ip}`;
    const allowed = rateLimiter.check(key, 10, 900000); // 900000ms = 15min
    
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', data: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    // Authenticate user
    let user, token: string;
    try {
      const result = await authService.login(email, password);
      user = result.user;
      token = result.token;
    } catch (authError) {
      const message = authError instanceof Error ? authError.message : 'Invalid email or password';
      return NextResponse.json(
        { success: false, error: message },
        { status: 401 }
      );
    }

    // Set HttpOnly cookie with security settings
    const response = NextResponse.json(
      { success: true, data: { user, token } },
      { status: 200 }
    );

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error instanceof Error ? error.message : error, error instanceof Error ? error.stack : '');
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
