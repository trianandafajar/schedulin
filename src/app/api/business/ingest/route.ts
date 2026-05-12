import { google } from "@ai-sdk/google";
import { embed } from "ai";
import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { content, metadata } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // 1. Generate embedding using Gemini
    const { embedding } = await embed({
      model: google.embedding("text-embedding-004"),
      value: content,
    });

    // 2. Save to Supabase
    const { error } = await supabase.from("knowledge_base").insert({
      content,
      embedding,
      metadata: metadata || {},
    });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Ingest error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
