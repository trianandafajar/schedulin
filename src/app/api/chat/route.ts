import { google } from "@ai-sdk/google";
import { streamText, embed, convertToModelMessages } from "ai";
import supabase from "@/lib/supabase";

export const maxDuration = 30;

export async function GET() {
  return new Response("API is working!");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, businessId: bodyBusinessId, businessSlug } = body;

    if (!messages || messages.length === 0) {
      return new Response("No messages provided", { status: 400 });
    }

    let businessId: string | null = bodyBusinessId ?? null;
    let businessName: string | null = null;

    if (!businessId && businessSlug) {
      const { data: business } = await supabase
        .from("business")
        .select("id, name")
        .eq("slug", businessSlug)
        .eq("is_public_enabled", true)
        .single();
      if (business) {
        businessId = business.id;
        businessName = business.name;
      }
    } else if (businessId) {
      const { data: business } = await supabase
        .from("business")
        .select("name")
        .eq("id", businessId)
        .single();
      if (business) businessName = business.name;
    }

    // Build a retrieval query from the last few user turns so follow-ups like
    // "what's the difference?" still pull in context from the earlier topic.
    const extractText = (msg: any): string =>
      (msg?.parts &&
        msg.parts
          .filter((p: any) => p.type === "text")
          .map((p: any) => p.text)
          .join(" ")) ||
      "";

    const recentUserTurns = messages
      .filter((m: any) => m.role === "user")
      .slice(-3)
      .map(extractText)
      .filter((t: string) => t.trim().length > 0);

    const retrievalQuery = recentUserTurns.join("\n");

    let embedding: number[] | null = null;
    try {
      const result = await embed({
        model: google.embedding("gemini-embedding-001"),
        value: retrievalQuery,
        providerOptions: {
          google: { outputDimensionality: 768 },
        },
      });
      embedding = result.embedding;
    } catch (embedError) {
      console.error("Embedding generation failed:", embedError);
    }

    let documents: any[] = [];
    if (embedding) {
      const { data, error: supabaseError } = await supabase.rpc(
        "match_knowledge_base",
        {
          query_embedding: embedding,
          match_threshold: 0.1,
          match_count: 5,
        },
      );
      if (supabaseError) {
        console.error("Supabase RPC error:", supabaseError);
      } else {
        documents = data || [];
      }
    }

    const context =
      documents.map((doc: any) => doc.content).join("\n\n") ||
      "No relevant information found.";

    const businessIntro = businessName
      ? `You are the AI assistant for "${businessName}". Help potential customers learn about this business, its services, hours, policies, and answer their questions accurately based on the CONTEXT below. If a follow-up question refers to something you discussed earlier in this conversation, use the earlier turns to interpret it. If the answer is not in the CONTEXT or in earlier turns, say you are not sure and suggest they contact the business directly.`
      : `You are a helpful AI assistant for an appointment and booking platform. Use the CONTEXT below plus the earlier turns of this conversation to answer the user's question. For follow-ups like "what's the difference" or "tell me more", refer back to the topic from earlier turns.`;

    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: `${businessIntro}
Answer in the same language as the user (default to English if unsure). Keep answers concise and friendly.

CONTEXT:
${context}`,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
