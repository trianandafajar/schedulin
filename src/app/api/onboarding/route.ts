import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import supabase from "@/actions/supabase";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { businessName, categoryId, email, fullName } = body;

    const { error: userError } = await supabase.from("users").upsert({
      id: userId,
      email,
      full_name: fullName,
      role: "admin",
    });

    if (userError) throw userError;

    const slug = `${generateSlug(businessName)}-${userId.slice(0, 6)}`;

    const { error: businessError } = await supabase
      .from("business")
      .upsert(
        {
          owner_id: userId,
          name: businessName,
          slug,
          category_id: categoryId,
          is_public_enabled: false,
        },
        {
          onConflict: "owner_id",
        }
      );

    if (businessError) throw businessError;

    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { onboardingComplete: true },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}
