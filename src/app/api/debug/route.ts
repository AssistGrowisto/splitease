import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { config } from '@/lib/config';

export async function GET(request: NextRequest) {
  try {
    const credentialsB64 = process.env.GOOGLE_CREDENTIALS_B64;
    let credentials: Record<string, string>;
    if (credentialsB64) {
      const json = Buffer.from(credentialsB64, 'base64').toString('utf-8');
      credentials = JSON.parse(json);
    } else {
      const pk = config.google.privateKey || '';
      let privateKey = pk;
      if (!pk.startsWith('-----BEGIN')) {
        try {
          const decoded = Buffer.from(pk, 'base64').toString('utf-8');
          if (decoded.startsWith('-----BEGIN')) privateKey = decoded;
        } catch(e) {
          privateKey = pk.replace(/\\n/g, '\n');
        }
      }
      credentials = {
        client_email: config.google.serviceAccountEmail,
        private_key: privateKey,
      };
    }

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = config.google.sheetId;

    const expensesRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Expenses!A1:Z5',
    });

    return NextResponse.json({
      expenses_raw: expensesRes.data.values,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, stack: error.stack?.substring(0, 500) }, { status: 500 });
  }
}
