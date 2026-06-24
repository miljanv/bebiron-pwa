import { NextResponse } from 'next/server';

import { sendDueFeedingReminders, syncFeedingReminderJobs } from '@/lib/server/feeding-reminder-sync';
import { createAdminClient } from '@/lib/server/supabase-admin';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { locale?: string };
  const locale = body.locale === 'en' ? 'en' : 'sr';

  try {
    await syncFeedingReminderJobs(supabase, user.id, locale);

    // Hobby-friendly fallback: deliver due reminders when the app syncs
    // (replaces Vercel Cron, which requires Pro for frequent schedules).
    try {
      const admin = createAdminClient();
      await sendDueFeedingReminders(admin);
    } catch {
      // Optional if SUPABASE_SERVICE_ROLE_KEY is not configured.
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to sync reminders';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
