"use server";

import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

async function getSupabaseClient() {
    const cookieStore = await cookies();
    return createClient(cookieStore);
}

export async function getMyBusinessInfo() {
    const supabase = await getSupabaseClient();
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
