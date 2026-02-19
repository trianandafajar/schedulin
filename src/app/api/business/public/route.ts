import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import supabase from "@/actions/supabase"; 

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { businessId, isEnabled } = body;

    if (!businessId) {
      return NextResponse.json({ error: "Business ID is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from('business')
      .update({ is_public_enabled: isEnabled })
      .eq('id', businessId)

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}