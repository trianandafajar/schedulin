import { NextResponse } from "next/server";
import supabase from "@/actions/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('business_categories_master')
      .select('id, name')
      .order('name');

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}