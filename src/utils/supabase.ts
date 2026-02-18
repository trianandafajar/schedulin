'use client';
import { useSession } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';

function createClerkSupabaseClient(session: any) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!, 
    {
      global: {
        fetch: async (url, options = {}) => {
          const clerkToken = await session?.getToken({ template: 'supabase' });
          
          const headers = new Headers(options?.headers);
          headers.set('Authorization', `Bearer ${clerkToken}`);
          
          return fetch(url, {
            ...options,
            headers,
          });
        },
      },
    }
  );
}

export default function UserProfile() {
  const { session } = useSession();
  
  const loadData = async () => {
    if (!session) return;
    const supabase = createClerkSupabaseClient(session);
    
    const { data } = await supabase.from('business').select('*');
  };
}