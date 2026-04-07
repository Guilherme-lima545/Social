import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'data');
const filePath = path.join(dir, 'feedbacks.xlsx');

type FeedbackData = {
  nome: string;
  feedback: string;
};

function readData(): FeedbackData[] {
  if (!fs.existsSync(filePath)) return [];

  const buffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(buffer, { type: 'buffer' });

  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  return XLSX.utils.sheet_to_json<FeedbackData>(sheet);
}

function writeData(data: FeedbackData[]) {
  const sheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, sheet, 'Feedbacks');

  const buffer = XLSX.write(workbook, {
    type: 'buffer',
    bookType: 'xlsx',
  });

  fs.writeFileSync(filePath, buffer);
}

export async function POST(req: Request) {
  const body: FeedbackData = await req.json();

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const data = readData(); 
  data.push(body);

  writeData(data); 

  return NextResponse.json({ success: true });
}