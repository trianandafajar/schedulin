"use server";

import { auth } from "@clerk/nextjs/server";
import supabase from "@/lib/supabase";

export async function getMyBusinessInfo() {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const { data: business, error } = await supabase
        .from("business")
        .select("id, slug, is_public_enabled")
        .eq("owner_id", userId)
        .single();

    if (error || !business) {
        return { error: "Business not found" };
    }

    return { success: true, business };
}
