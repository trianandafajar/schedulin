import { google } from "@ai-sdk/google";
import { streamText, embed, convertToModelMessages } from "ai";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export const maxDuration = 30;

export async function GET() {
  return new Response("API is working!");
}

async function getSupabaseClient() {
  const cookieStore = await cookies();
  return createClient(cookieStore);
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    if (!messages || messages.length === 0) {
      return new Response("No messages provided", { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    const lastMessageText = (lastMessage.parts && lastMessage.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join(' ')) || "";

    console.log("Generating embedding for:", lastMessageText);

    let embedding = null;
    try {
      const result = await embed({
        model: google.embedding("text-embedding-004"),
        value: lastMessageText,
      });
      embedding = result.embedding;
      console.log("Embedding generated successfully.");
    } catch (embedError) {
      console.error("Embedding generation failed:", embedError);
    }

    console.log("Searching Supabase (if embedding available)...");

    let documents = [];
    if (embedding) {
      const supabase = await getSupabaseClient();
      const { data, error: supabaseError } = await supabase.rpc("match_knowledge_base", {
        query_embedding: embedding,
        match_threshold: 0.1,
        match_count: 5,
      });
      if (supabaseError) {
        console.error("Supabase RPC error:", supabaseError);
      } else {
        documents = data || [];
      }
    }

    const context = documents
      ?.map((doc: any) => doc.content)
      .join("\n\n") || "No relevant information found.";

    console.log("Calling Gemini with context...");

    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: `You are Maketime CS AI, a helpful assistant for Maketime, an appointment and booking platform.
      Use the following context to answer the user's question. 
      If the context doesn't contain the answer, say you don't know but try to be helpful with general Maketime information.
      Answer in the same language as the user (default to Indonesian if unsure).
      
      CONTEXT:
      ${context}`,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
