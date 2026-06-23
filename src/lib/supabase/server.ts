import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { assertSupabaseConfig, getSupabaseAnonKey, getSupabaseUrl } from '@/lib/supabase/env';

export async function createClient() {
  assertSupabaseConfig();
  const cookieStore = await cookies();
  return createServerClient(
    getSupabaseUrl(),
    getSupabaseAnonKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component without a Server Action / Route Handler.
            // Middleware will refresh the session, so this is safe to ignore.
          }
        },
      },
    },
  );
}
