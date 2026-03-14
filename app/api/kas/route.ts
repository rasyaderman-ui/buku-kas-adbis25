import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {

  const tahunSekarang = new Date().getFullYear();

  const { data, error } = await supabase
  .from("kas")
  .select("nama, bulan")
  .eq("Tahun", tahunSekarang);

  if (error) {
    return NextResponse.json({ error: error.message });
  }

  const result: { [key: string]: string[] } = {};

  data.forEach((row) => {
    if (!result[row.nama]) {
      result[row.nama] = [];
    }
    result[row.nama].push(row.bulan);
  });

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { nama, bulan } = body;

  const tahunSekarang = new Date().getFullYear();

  const { error } = await supabase
    .from("kas")
    .insert([{ nama, bulan, tahun: tahunSekarang }]);

  if (error) {
    return NextResponse.json({ error: error.message });
  }

  return NextResponse.json({ success: true });
}