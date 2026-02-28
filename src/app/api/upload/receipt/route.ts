import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/middleware/auth';
import { googleDriveService } from '@/lib/services/google-drive';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    
    if (!authResult.user_id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { image_data, format } = body;

    if (!image_data || !format) {
      return NextResponse.json(
        { success: false, error: 'Missing image data or format' },
        { status: 400 }
      );
    }

    // Validate format
    if (!ALLOWED_FORMATS.includes(format)) {
      return NextResponse.json(
        { success: false, error: `Invalid format. Allowed: ${ALLOWED_FORMATS.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate size (base64 is ~33% larger than original)
    const buffer = Buffer.from(image_data, 'base64');
    if (buffer.length > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: `File size exceeds ${MAX_SIZE / 1024 / 1024}MB limit` },
        { status: 413 }
      );
    }

    // Upload to Google Drive
    const fileId = await googleDriveService.uploadReceipt(
      image_data,
      format,
      `receipt_${authResult.user_id}_${Date.now()}`
    );

    return NextResponse.json(
      { success: true, data: { file_id: fileId } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Upload receipt error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload receipt' },
      { status: 500 }
    );
  }
}
