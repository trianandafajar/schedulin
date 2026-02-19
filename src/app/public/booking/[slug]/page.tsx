import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CalenderIcon, MailIcon } from "@/icons";
import supabase from "@/actions/supabase";
export default async function PublicBookingPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const { data: business } = await supabase
    .from('business')
    .select('id, name, description, address, logo_url')
    .eq('slug', slug)
    .eq('is_public_enabled', true)
    .single();

  if (!business) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">

      <div className="relative bg-gradient-to-r from-teal-500 to-emerald-600 p-8 text-white text-center overflow-hidden">

        <Link href="/" className="hover:underline hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
          Buat halaman booking bisnis Anda sendiri &rarr;
        </Link>
      </div>
    </div>
  );
}