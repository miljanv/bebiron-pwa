import type { SupabaseClient } from '@supabase/supabase-js';

import { computeFeedFireAt, getLastFeedAt } from '@/lib/utils/feed-reminder';
import { toGenitive } from '@/lib/utils/serbian-grammar';
import type { Activity, Baby } from '@/types';

type UserSettings = {
  feeding_reminder_enabled: boolean;
  feeding_reminder_minutes: number;
};

type ReminderJobRow = {
  id: string;
  user_id: string;
  baby_id: string;
  baby_name: string;
  fire_at: string;
  sent_at: string | null;
  locale: string;
};

type PushSubscriptionRow = {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
};

function mapActivity(row: {
  id: string;
  baby_id: string;
  type: 'feed' | 'sleep' | 'diaper';
  date: string;
  time: string | null;
  start_time: string | null;
  end_time: string | null;
  quantity_ml: number | null;
  feed_type: string | null;
  diaper_type: string | null;
  created_at: string | null;
}): Activity {
  const base = {
    id: row.id,
    babyId: row.baby_id,
    date: row.date,
    createdAt: row.created_at ?? undefined,
  };
  if (row.type === 'feed') {
    return {
      ...base,
      type: 'feed',
      time: row.time ?? '00:00',
      quantityMl: row.quantity_ml ?? 0,
      feedType: row.feed_type ?? '',
    };
  }
  if (row.type === 'sleep') {
    return {
      ...base,
      type: 'sleep',
      startTime: row.start_time ?? '00:00',
      endTime: row.end_time ?? '00:00',
    };
  }
  return {
    ...base,
    type: 'diaper',
    time: row.time ?? '00:00',
    diaperType: (row.diaper_type as 'wet' | 'dirty' | 'both') ?? 'wet',
  };
}

function mapBaby(row: {
  id: string;
  user_id: string;
  name: string;
  birth_date: string;
  birth_time: string | null;
  gender: string | null;
  avatar_uri: string | null;
  created_at: string | null;
}): Baby {
  return {
    id: row.id,
    name: row.name,
    birthDate: row.birth_date,
    birthTime: row.birth_time ?? undefined,
    gender:
      row.gender === 'male' || row.gender === 'female' ? row.gender : undefined,
    avatarUri: row.avatar_uri ?? undefined,
    isOwner: true,
  };
}

function reminderTitle(locale: string): string {
  return locale === 'en' ? 'Feeding reminder' : 'Podsetnik za hranjenje';
}

function reminderBody(babyName: string, locale: string): string {
  const name = locale === 'sr' ? toGenitive(babyName) : babyName;
  return locale === 'en'
    ? `Time for ${name}'s next feeding!`
    : `Vreme je za sledeće hranjenje ${name}!`;
}

export async function syncFeedingReminderJobs(
  supabase: SupabaseClient,
  userId: string,
  locale: string,
): Promise<void> {
  const { data: settingsRow } = await supabase
    .from('user_settings')
    .select('feeding_reminder_enabled, feeding_reminder_minutes')
    .eq('user_id', userId)
    .maybeSingle();

  const settings: UserSettings = {
    feeding_reminder_enabled: settingsRow?.feeding_reminder_enabled ?? false,
    feeding_reminder_minutes: settingsRow?.feeding_reminder_minutes ?? 180,
  };

  const { data: ownedBabies } = await supabase
    .from('babies')
    .select('id, user_id, name, birth_date, birth_time, gender, avatar_uri, created_at')
    .eq('user_id', userId);

  const { data: caregiverRows } = await supabase
    .from('baby_caregivers')
    .select('baby_id')
    .eq('user_id', userId)
    .eq('role', 'caregiver');

  const caregiverBabyIds = (caregiverRows ?? []).map((r) => r.baby_id);
  let caregiverBabies: typeof ownedBabies = [];
  if (caregiverBabyIds.length > 0) {
    const { data } = await supabase
      .from('babies')
      .select('id, user_id, name, birth_date, birth_time, gender, avatar_uri, created_at')
      .in('id', caregiverBabyIds);
    caregiverBabies = data ?? [];
  }

  const babies = [...(ownedBabies ?? []), ...caregiverBabies].map((b) =>
    mapBaby({ ...b, user_id: b.user_id }),
  );

  const babyIds = babies.map((b) => b.id);
  let activities: Activity[] = [];
  if (babyIds.length > 0) {
    const { data: activityRows } = await supabase
      .from('activities')
      .select('*')
      .in('baby_id', babyIds)
      .order('date', { ascending: false })
      .limit(500);
    activities = (activityRows ?? []).map(mapActivity);
  }

  if (!settings.feeding_reminder_enabled || babies.length === 0) {
    await supabase.from('feeding_reminder_jobs').delete().eq('user_id', userId);
    return;
  }

  const delayMinutes = settings.feeding_reminder_minutes;
  const now = Date.now();

  for (const baby of babies) {
    const lastFeed = getLastFeedAt(activities, baby.id);
    if (!lastFeed) {
      await supabase
        .from('feeding_reminder_jobs')
        .delete()
        .eq('user_id', userId)
        .eq('baby_id', baby.id);
      continue;
    }

    const fireAt = computeFeedFireAt(lastFeed, delayMinutes);
    if (fireAt.getTime() <= now) {
      await supabase
        .from('feeding_reminder_jobs')
        .delete()
        .eq('user_id', userId)
        .eq('baby_id', baby.id);
      continue;
    }

    await supabase.from('feeding_reminder_jobs').upsert(
      {
        user_id: userId,
        baby_id: baby.id,
        baby_name: baby.name,
        fire_at: fireAt.toISOString(),
        sent_at: null,
        locale,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,baby_id' },
    );
  }
}

export async function sendDueFeedingReminders(admin: SupabaseClient): Promise<number> {
  const nowIso = new Date().toISOString();
  const { data: jobs, error } = await admin
    .from('feeding_reminder_jobs')
    .select('*')
    .is('sent_at', null)
    .lte('fire_at', nowIso);

  if (error) throw error;
  if (!jobs?.length) return 0;

  const { sendWebPushToUser } = await import('@/lib/server/push-sender');

  let sentCount = 0;
  for (const job of jobs as ReminderJobRow[]) {
    const payload = {
      title: reminderTitle(job.locale),
      body: reminderBody(job.baby_name, job.locale),
      url: '/home',
      tag: `bebiron-feed-${job.baby_id}`,
      data: { kind: 'feed', babyId: job.baby_id },
    };

    const sent = await sendWebPushToUser(admin, job.user_id, payload);
    if (sent > 0) {
      await admin
        .from('feeding_reminder_jobs')
        .update({ sent_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq('id', job.id);
      sentCount += sent;
    }
  }

  return sentCount;
}

export type { PushSubscriptionRow, ReminderJobRow };
