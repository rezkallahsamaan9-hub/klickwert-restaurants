import { google } from 'googleapis';

const SHEET_ID = 'REDACTED_SHEET_ID';
const TELEGRAM_TOKEN = 'REDACTED_TELEGRAM_TOKEN';
const TELEGRAM_CHAT_ID = 'REDACTED_CHAT_ID';

async function appendToSheet(data) {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT env var missing');
  const creds = JSON.parse(raw);
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
        data.Datum || '',
        data.Name || '',
        data.Email || '',
        data.Telefon || '',
        data.Website || '',
        data.Dienstleistungen || '',
        data.Nachricht || '',
      ]],
    },
  });
}

async function sendTelegram(data) {
  const text = [
    '🔔 Neue Anfrage!',
    '',
    'Name: ' + (data.Name || '–'),
    'E-Mail: ' + (data.Email || '–'),
    'Telefon: ' + (data.Telefon || '–'),
    'Website: ' + (data.Website || '–'),
    'Services: ' + (data.Dienstleistungen || '–'),
    'Nachricht: ' + (data.Nachricht || '–'),
  ].join('\n');
  await fetch('https://api.telegram.org/bot' + TELEGRAM_TOKEN + '/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
  });
}

async function sendConfirmationEmail(data) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY missing');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey,
    },
    body: JSON.stringify({
      from: 'KlickWert <noreply@klick-wert.com>',
      to: data.Email,
      subject: 'Ihre Anfrage bei KlickWert – Bestätigung',
      html: '<p>Hallo ' + (data.Name || '') + ',</p>' +
        '<p>vielen Dank für Ihre Anfrage! Wir haben folgende Angaben erhalten:</p>' +
        '<p><strong>Interesse an:</strong> ' + (data.Dienstleistungen || '–') + '</p>' +
        '<p>Wir melden uns innerhalb von 24 Stunden bei Ihnen.</p>' +
        '<p>Bei dringenden Fragen erreichen Sie uns unter rezk@klick-wert.com.</p>' +
        '<p>Mit freundlichen Grüßen<br>Ihr KlickWert-Team</p>',
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error('Resend error: ' + err);
  }
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

  const errors = [];

  try {
    await sendTelegram(data);
  } catch (err) {
    console.error('Telegram error:', err);
    errors.push('telegram');
  }

  try {
    await appendToSheet(data);
  } catch (err) {
    console.error('Sheet error:', err.message, err.response?.data || '');
    errors.push('sheet: ' + err.message);
  }

  try {
    await sendConfirmationEmail(data);
  } catch (err) {
    console.error('Email error:', err.message);
    errors.push('email: ' + err.message);
  }

  if (errors.length === 3) {
    return res.status(500).json({ error: 'Both services failed', details: errors });
  }

  return res.status(200).json({ status: 'ok', warnings: errors.length ? errors : undefined });
}
