const { google } = require('googleapis');

const SHEET_ID = '1FpZfDzSdh747c0ZEr8ozC0hNcrUkXxVOW57pshbebZw';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: 'cosway-dashboard@cosway-dashboard.iam.gserviceaccount.com',
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCt+KnwHo+DAXdv\nToyBq6mynidjOFJv+EsM+vt1hrux0JoIl+IXrFQPpEVdYylaGwuh4zDlqsKNeZPi\nRrGQ/yVV8HJLZjvTAPyVI/O/Tp+oDqRky7b6Er8QwO1DFWO9ryQTWsRKUW1/FXO1\nyG5wG2u3KZeT8mst2tx+O6LaLyNi2Z05ro8poT4C2lZdh9IA7Zc+HYT5kRcsGM51\n/MwCyV/0hnMRqnyUhpqaGXVzLf5qnlSRGj5LS4JSv90lX/aq7GAvHDRW59HgXBKY\nU+w3ZR4P2vr0eBeZOW9yAZTLo9NPO2M7uc7o+D60p/DKdB41pXlk5JAIPKxAmIef\nAmed6n2RAgMBAAECggEACcxnDGHZQwd7rcyIlgNYVInLNb+552nudrPCYtRAyS8i\nxNQCoUMUzTh7KmtLzIIYU7DxS6c0a93WkCSbistPE9X+BvyCJzRPlZoTuAE+dWuF\nM3LkmnVAtwmpt1j6oBfvpgorQvUO/+zSMoFwZG6r8IIWgigBxMB2YaL73TJxWZdo\ntrXf+0RpSdJzB597Kke4Jb0GVqD6T0tE1u1/Wz+yxyXVRziAjWNFD5JPFnYbMoJB\nddPXhuxLnxn+w+UHFYnG/lQqR9wLEUWYzVsLhVyplaZXwHUq2ktln4Bvd59taH+u\nyNpqpCd8MeCK4noqPR1iPXdieJ2K+alkj4MPr5W7IQKBgQDZhpUuwk39IT5CNBiW\nOXxmRdgjg6S/9nm8YZz1LXWDRXt3QTqQt5ki9cnKyHX3ydkPZRsPcmskZ3NcpQF3\nhiKJdP5FlWiAdtdLWHvxtm2ebLGSg670fCd4ouRO7L5iCZigOlz5VuIEBQbLsliq\ntSupUPDGIQMJFBlj4KRw6L6f8QKBgQDMvff2/PS+3natOwlo9DkGCtmyyQtOrEtU\nNnKE54VIqotk4eHN0G4eczr3YmhlZI11nDD0cOr5mdESy3fgo20WjlfjUb/SmPej\nFH2Npl3N6HpSLbv6MVodnq3kV2XrV0EQq8qYu7iV1f8O/qjOce7qK3+FOZziybXi\nQg3LLX1XoQKBgG2xoZ9/2sZQsk2+abuv55zHkfRu2XD4gXFPJFC7iOwW6Ok9mqQK\nAg6QNh+tsVewkWZjDR9gCsnD5XgNucyldtsshWFfs+A8jdtwFqjQ3zyqAW4qO9sM\nlPcP5eQrHOLhhfcfF22hs75lLoUgPfhv/kGXEKRJV3eHjDpCuYo6xI5xAoGBAJ0H\nNh8gczXQuYSzOsxcQz/3InCU8S8txbiY6cw1JWxOIQsGk4Ce01ZXWmpR92+MZ1JE\nsOdJk25MIqYfl5mavhgGpDGciVqkJ4nUNVdmuZsrKmXM3ddN8qe1A/mVbn3JNgXr\nPD9X+oIw1qZRenabu3muUueDAGiP/AfEUX/7K58BAoGABjPJrOoWojxCeL64rMUh\nS/cXoCBQ+BzWha+eaH9p4FTICGeh3akZSAcsav6BDeEP+Rbbrc0ShdUYck7hJyr7\nW6T/Q6SjgaTtjdETrX0lLwzAwVlUz7ouq+lIqu8i3HgFE+4F3A2czOmf55GanUig\ne3vy5H9o/agFGRbX/E/ZWZc=\n-----END PRIVATE KEY-----\n",
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const TABS = [
  {
    name: 'Users',
    headers: ['user_id', 'email', 'display_name', 'password_hash', 'created_at', 'updated_at', 'status']
  },
  {
    name: 'Groups',
    headers: ['group_id', 'group_name', 'created_by', 'base_currency', 'status', 'created_at', 'updated_at']
  },
  {
    name: 'Group_Members',
    headers: ['membership_id', 'group_id', 'user_id', 'role', 'joined_at', 'removed_at', 'status']
  },
  {
    name: 'Expenses',
    headers: ['expense_id', 'group_id', 'description', 'total_amount', 'currency', 'converted_amount', 'conversion_rate', 'split_type', 'expense_date', 'created_by', 'receipt_url', 'is_settlement', 'status', 'created_at', 'updated_at']
  },
  {
    name: 'Expense_Payers',
    headers: ['payer_entry_id', 'expense_id', 'user_id', 'amount_paid']
  },
  {
    name: 'Expense_Splits',
    headers: ['split_entry_id', 'expense_id', 'user_id', 'split_amount', 'split_percentage']
  },
  {
    name: 'Activity_Log',
    headers: ['log_id', 'expense_id', 'group_id', 'user_id', 'action', 'details', 'timestamp']
  },
  {
    name: 'Currency_Rates',
    headers: ['from_currency', 'to_currency', 'rate', 'updated_at']
  }
];

async function setup() {
  const sheets = google.sheets({ version: 'v4', auth });

  // Step 1: Get existing sheet info
  console.log('Fetching spreadsheet info...');
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
  const existingSheets = spreadsheet.data.sheets || [];
  console.log(`Found ${existingSheets.length} existing sheet(s): ${existingSheets.map(s => s.properties.title).join(', ')}`);

  // Step 2: Create missing tabs
  const existingNames = existingSheets.map(s => s.properties.title);
  const requests = [];

  for (const tab of TABS) {
    if (!existingNames.includes(tab.name)) {
      requests.push({
        addSheet: {
          properties: { title: tab.name }
        }
      });
      console.log(`Will create tab: ${tab.name}`);
    } else {
      console.log(`Tab already exists: ${tab.name}`);
    }
  }

  if (requests.length > 0) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: { requests }
    });
    console.log(`Created ${requests.length} new tab(s)`);
  }

  // Step 3: Add headers to each tab
  console.log('\nAdding headers to tabs...');
  const headerData = TABS.map(tab => ({
    range: `${tab.name}!A1:${String.fromCharCode(64 + tab.headers.length)}1`,
    values: [tab.headers]
  }));

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: {
      valueInputOption: 'RAW',
      data: headerData
    }
  });
  console.log('Headers added to all tabs');

  // Step 4: Add initial Currency_Rates data
  console.log('\nAdding initial currency rates...');
  const now = new Date().toISOString();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: 'Currency_Rates!A2',
    valueInputOption: 'RAW',
    requestBody: {
      values: [
        ['USD', 'INR', '83.50', now],
        ['INR', 'USD', '0.012', now]
      ]
    }
  });
  console.log('Added USD↔INR conversion rates');

  // Step 5: Delete the default "Sheet1" if our tabs exist
  const updatedSpreadsheet = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
  const allSheets = updatedSpreadsheet.data.sheets || [];
  const sheet1 = allSheets.find(s => s.properties.title === 'Sheet1');
  if (sheet1 && allSheets.length > 1) {
    try {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: {
          requests: [{ deleteSheet: { sheetId: sheet1.properties.sheetId } }]
        }
      });
      console.log('Removed default Sheet1');
    } catch (e) {
      console.log('Could not remove Sheet1 (may be in use)');
    }
  }

  console.log('\n✅ Google Sheet setup complete!');
  console.log(`Sheet URL: https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`);
  console.log('\nTabs created: ' + TABS.map(t => t.name).join(', '));
}

setup().catch(err => {
  console.error('Setup failed:', err.message);
  if (err.response) {
    console.error('Details:', JSON.stringify(err.response.data, null, 2));
  }
});
