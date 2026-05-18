import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase URL or Publishable Key is missing from environment variables.");
}

const supabase = createBrowserClient(
  supabaseUrl || "",
  supabaseKey || ""
);

export default supabase;
