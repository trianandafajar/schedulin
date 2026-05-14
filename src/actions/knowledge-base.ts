"use server";

import { auth } from "@clerk/nextjs/server";
import { google } from "@ai-sdk/google";
import { embed } from "ai";
import supabase from "@/lib/supabase";

export interface KnowledgeEntry {
  id: string;
  content: string;
  metadata: Record<string, any>;
  created_at: string;
}

async function requireAuth(): Promise<{ userId: string | null; error: string | null }> {
  const { userId } = await auth();
  if (!userId) return { userId: null, error: "Unauthorized" };
  return { userId, error: null };
}

export async function listKnowledgeEntries(): Promise<{ data: KnowledgeEntry[]; error: string | null }> {
  const { error: authError } = await requireAuth();
  if (authError) return { data: [], error: authError };

  const { data, error } = await supabase
    .from("knowledge_base")
    .select("id, content, metadata, created_at")
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: (data ?? []) as KnowledgeEntry[], error: null };
}

export async function addKnowledgeEntry(content: string, title?: string): Promise<{ success: boolean; error: string | null }> {
  const trimmed = content.trim();
  if (!trimmed) return { success: false, error: "Content cannot be empty" };

  const { error: authError } = await requireAuth();
  if (authError) return { success: false, error: authError };

  try {
    const { embedding } = await embed({
      model: google.embedding("gemini-embedding-001"),
      value: trimmed,
      providerOptions: {
        google: { outputDimensionality: 768 },
      },
    });

    const { error } = await supabase.from("knowledge_base").insert({
      content: trimmed,
      embedding,
      metadata: title ? { title } : {},
    });

    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  } catch (e: any) {
    return { success: false, error: e.message ?? "Failed to embed content" };
  }
}

export async function updateKnowledgeEntry(
  id: string,
  content: string,
  title?: string
): Promise<{ success: boolean; error: string | null }> {
  const trimmed = content.trim();
  if (!trimmed) return { success: false, error: "Content cannot be empty" };

  const { error: authError } = await requireAuth();
  if (authError) return { success: false, error: authError };

  try {
    const { embedding } = await embed({
      model: google.embedding("gemini-embedding-001"),
      value: trimmed,
      providerOptions: {
        google: { outputDimensionality: 768 },
      },
    });

    const { error } = await supabase
      .from("knowledge_base")
      .update({
        content: trimmed,
        embedding,
        metadata: title ? { title } : {},
      })
      .eq("id", id);

    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  } catch (e: any) {
    return { success: false, error: e.message ?? "Failed to embed content" };
  }
}

export async function deleteKnowledgeEntry(id: string): Promise<{ success: boolean; error: string | null }> {
  const { error: authError } = await requireAuth();
  if (authError) return { success: false, error: authError };

  const { error } = await supabase
    .from("knowledge_base")
    .delete()
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true, error: null };
}
