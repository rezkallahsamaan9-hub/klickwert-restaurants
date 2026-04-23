import { google } from 'googleapis';

const SHEET_ID = 'REDACTED_SHEET_ID';
const TELEGRAM_TOKEN = 'REDACTED_TELEGRAM_TOKEN';
const TELEGRAM_CHAT_ID = 'REDACTED_CHAT_ID';

async function appendToSheet(data) {
  const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: 'Tabellenblatt1!A:G',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        data.Datum,
        data.Name,
        data.Email,
        data.Telefon,
        data.Website,
        data.Dienstleistungen,
        data.Nachricht,
      ]],
    },
  });
}

async function sendTelegram(data) {
  const text = `🔔 Neue Anfrage!\n\nName: ${data.Name || '–'}\nE-Mail: ${data.Email || '–'}\nTelefon: ${data.Telefon || '–'}\nWebsite: ${data.Website || '–'}\nServices: ${data.Dienstleistungen || '–'}\nNachricht: ${data.Nachricht || '–'}`;
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
  });
}

async function sendConfirmationEmail(data) {
  const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/gmail.send'],
    clientOptions: { subject: 'rezk@klick-wert.com' },
  });
  // Gmail API requires domain-wide delegation which is complex to set up.
  // For now, we skip email and rely on Telegram notification.
  // Email can be added later with Resend, Mailgun, or SMTP.
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const data = req.body || {};
  if (!data.Name || !data.Email) {
    return res.status(400).json({ error: 'Name and Email required' });
  }

  try {
    await Promise.all([
      appendToSheet(data),
      sendTelegram(data),
    ]);
    return res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error('Contact handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
