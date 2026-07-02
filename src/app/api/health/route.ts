import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  let databaseOk = false;

  try {
    const { error } = await supabase.from("business").select("id").limit(1);
    databaseOk = !error;
  } catch {
    databaseOk = false;
  }

  return NextResponse.json({
    status: databaseOk ? "ok" : "degraded",
    api: true,
    database: databaseOk,
  });
}
