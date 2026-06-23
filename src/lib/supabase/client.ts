import { createBrowserClient } from '@supabase/ssr';

import { assertSupabaseConfig, getSupabaseAnonKey, getSupabaseUrl } from '@/lib/supabase/env';

let browserClient: ReturnType<typeof createBrowserClient> | undefined;

export function createClient() {
  if (browserClient) return browserClient;
  assertSupabaseConfig();
  browserClient = createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey());
  return browserClient;
}
