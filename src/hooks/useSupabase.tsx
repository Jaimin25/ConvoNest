import { useEffect, useState } from 'react';

import { createBrowserClient } from '@supabase/ssr';
import { type Session, SupabaseClient } from '@supabase/supabase-js';

export default function useSupabase() {
  const [supabase, setSupabase] = useState<SupabaseClient>(
    null! as SupabaseClient
  );
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );
    async function getSession() {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    }
    getSession();
    setSupabase(supabase);
  }, []);

  return { supabase, session };
}
