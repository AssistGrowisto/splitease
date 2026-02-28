import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { config } from '@/lib/config';

export async function DELETE(request: NextRequest) {
  const secret = request.headers.get('x-admin-secret');
  if (secret !== 'temp-cleanup-secret-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }

  const credentialsB64 = process.env.GOOGLE_CREDENTIALS_B64;
  let credentials: Record<string, string> = {};
  if (credentialsB64) {
    credentials = JSON.parse(Buffer.from(credentialsB64, 'base64').toString('utf-8'));
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = config.google.sheetId;

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Users!A:G',
  });

  const rows = res.data.values || [];
  const rowsToDelete: number[] = [];

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][1] === email) {
      rowsToDelete.push(i + 1);
    }
  }

  if (rowsToDelete.length === 0) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  // Delete rows from bottom to top
  for (const rowIndex of rowsToDelete.reverse()) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{
          deleteDimension: {
            range: {
              sheetId: 0,
              dimension: 'ROWS',
              startIndex: rowIndex - 1,
              endIndex: rowIndex,
            },
          },
        }],
      },
    });
  }

  return NextResponse.json({ message: 'Deleted ' + rowsToDelete.length + ' row(s) for ' + email });
}
