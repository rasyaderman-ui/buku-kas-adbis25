import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("kas")
    .select("nama, bulan");

  if (error) {
    return NextResponse.json({ error: error.message });
  }

  // Ubah jadi format { nama: [bulan, bulan] }
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

  const { error } = await supabase
    .from("kas")
    .insert([{ nama, bulan }]);

  if (error) {
    return NextResponse.json({ error: error.message });
  }

  return NextResponse.json({ success: true });
}
