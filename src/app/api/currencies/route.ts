import { NextRequest, NextResponse } from 'next/server';
import { currencyRateRepo } from '@/lib/repositories';
import { verifyAuth } from '@/lib/middleware/auth';
import { cacheManager } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    await verifyAuth(request);

    // Check cache first
    const cacheKey = 'currency:rates:all';
    let rates = cacheManager.get(cacheKey);

    if (!rates) {
      // Fetch from database
      rates = await currencyRateRepo.findAll();
      
      // Cache for 1 hour
      cacheManager.set(cacheKey, rates, 3600);
    }

    return NextResponse.json(
      { success: true, data: { rates } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get currencies error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
