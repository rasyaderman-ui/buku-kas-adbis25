import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "kas.json");

function getData() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}));
  }
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

function saveData(data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export async function GET() {
  const data = getData();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { nama, bulan } = body;

  const data = getData();

  if (!data[nama]) {
    data[nama] = [];
  }

  if (!data[nama].includes(bulan)) {
    data[nama].push(bulan);
  }

  saveData(data);

  return NextResponse.json({ success: true });
}
