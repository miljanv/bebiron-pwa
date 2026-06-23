import { createClient } from '@supabase/supabase-js';

import { getSupabaseUrl } from '@/lib/supabase/env';

let adminClient: ReturnType<typeof createClient> | null = null;

export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY for server-side push delivery.');
  }
  if (!adminClient) {
    adminClient = createClient(getSupabaseUrl(), serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return adminClient;
}
