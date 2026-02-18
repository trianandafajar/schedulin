'use server'

import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export async function getBusinessCategories() {
  const { data, error } = await supabase
    .from('business_categories_master')
    .select('id, name')
    .order('name'); 
  
  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return data || [];
}

export async function completeOnboarding(
  businessName: string, 
  categoryId: string,
  clerkUserId: string,
  email: string,
  fullName: string
) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return { error: "Unauthorized: No active session found" };
  }

try {
    const { error: userError } = await supabase.from('users').upsert({
      id: clerkUserId,
      email: email,
      full_name: fullName,
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (userError) throw new Error(`User Sync Error: ${userError.message}`);

    const { error: businessError } = await supabase.from('business').insert({
      owner_id: clerkUserId,
      name: businessName,
      slug: `${businessName.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-4)}`,
      category_id: categoryId,
    });

    if (businessError) throw new Error(`Business Creation Error: ${businessError.message}`);

    const client = await clerkClient();
    await client.users.updateUserMetadata(clerkUserId, {
      publicMetadata: {
        onboardingComplete: true,
      },
    });
    return { success: true };

  } catch (error: any) {
    console.error("Onboarding Exception:", error);
    return { error: error.message };
  }
}