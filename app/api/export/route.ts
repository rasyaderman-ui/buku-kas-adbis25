import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic"; // ⛔ disable cache Vercel

export async function GET() {
  const { data, error } = await supabase
    .from("kas")
    .select("nama, bulan");

  if (error) {
    return NextResponse.json({ error: error.message });
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Laporan Kas");

  sheet.addRow(["Nama", "Jumlah Bulan Bayar", "Total Bayar (Rp)"]);

  const map: { [key: string]: string[] } = {};

  data.forEach((row) => {
    if (!map[row.nama]) map[row.nama] = [];
    map[row.nama].push(row.bulan);
  });

  Object.entries(map).forEach(([nama, bulanList]) => {
    const jumlah = bulanList.length;
    const total = jumlah * 10000;
    sheet.addRow([nama, jumlah, total]);
  });

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition":
        "attachment; filename=laporan-kas-" + Date.now() + ".xlsx",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
    }
  });
}
