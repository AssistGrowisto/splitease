import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { config } from '@/lib/config';
import { userRepo } from '@/lib/repositories';
import type { JwtPayload } from '@/types';

/**
 * Verifies JWT token from cookies or Authorization header
 * Returns user_id and email on success, throws error on failure
 */
export async function verifyAuth(request: NextRequest): Promise<{ user_id: string; email: string }> {
  try {
    // Try to get token from cookies first
    let token = request.cookies.get('auth_token')?.value;

    // If not in cookies, try Authorization header
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      throw new Error('No authentication token provided');
    }

    // Verify the token
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

    // Fetch user from repository to check status
    const user = await userRepo.findById(decoded.user_id);

    if (!user) {
      throw new Error('User not found');
    }

    if (user.status !== 'active') {
      throw new Error('User account is suspended');
    }

    return {
      user_id: decoded.user_id,
      email: decoded.email,
    };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid or expired token');
    }
    throw error;
  }
}

/**
 * Wrapper for API route handlers that injects authenticated user
 * Usage: withAuth(async (req, res, user) => { ... })
 */
export function withAuth(
  handler: (
    request: NextRequest,
    context: any,
    user: { user_id: string; email: string }
  ) => Promise<NextResponse>
) {
  return async (request: NextRequest, context: any) => {
    try {
      const user = await verifyAuth(request);
      return handler(request, context, user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Authentication failed';
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AUTHENTICATION_ERROR',
            message,
          },
        },
        { status: 401 }
      );
    }
  };
}
