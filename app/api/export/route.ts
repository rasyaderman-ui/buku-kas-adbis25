import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "data", "kas.json");

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Data kas belum ada" });
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Laporan Kas");

  sheet.addRow(["Nama", "Jumlah Bulan Bayar", "Total Bayar (Rp)"]);

  Object.entries(data).forEach(([nama, bulanList]: any) => {
    const jumlahBulan = bulanList.length;
    const total = jumlahBulan * 10000;
    sheet.addRow([nama, jumlahBulan, total]);
  });

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=laporan-kas.xlsx"
    }
  });
}
