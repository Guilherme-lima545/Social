import { NextResponse } from 'next/server';
import { google } from 'googleapis';

type FeedbackData = {
  nome: string;
  feedback: string;
};

async function getSheet() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

export async function POST(req: Request) {
  let body: FeedbackData;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  if (!body.nome || !body.feedback) {
    return NextResponse.json({ error: 'Campos obrigatórios' }, { status: 400 });
  }

  try {
    const sheets = await getSheet();

      const meta = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
    });

    const sheetName = meta.data.sheets?.[0].properties?.title;
    console.log('Nome da aba:', sheetName);

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `'${sheetName}'!A:C`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[body.nome, body.feedback, new Date().toLocaleString('pt-BR')]],
      },
    });
  } catch (err) {
    console.error('Erro Google Sheets:', err);
    return NextResponse.json({ error: 'Erro ao salvar' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}