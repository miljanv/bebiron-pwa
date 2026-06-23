'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import type { Locale } from '@/lib/i18n/config';
import {
  computeFeedReminderSchedule,
  formatFeedReminderCardText,
  getLastFeedAt,
  type FeedReminderSchedule,
} from '@/lib/utils/feed-reminder';

import { useActivities } from './use-activities';
import { useBabies } from './use-babies';
import { useNotificationSettings } from './use-notification-settings';

export function useFeedingReminder(babyId: string | null) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const { data: settings } = useNotificationSettings();
  const { data: activities = [] } = useActivities();
  const { data: babies = [] } = useBabies();
  const [tick, setTick] = useState(0);

  const baby = babies.find((b) => b.id === babyId);
  const enabled = settings?.feedingReminderEnabled ?? false;
  const minutes = settings?.feedingReminderMinutes ?? 180;

  const schedule: FeedReminderSchedule | null = useMemo(() => {
    if (!babyId || !enabled) return null;
    const lastFeedAt = getLastFeedAt(activities, babyId);
    if (!lastFeedAt) return null;
    return computeFeedReminderSchedule(lastFeedAt, minutes);
    // tick is included to refresh memo as time passes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [babyId, enabled, minutes, activities, tick]);

  useEffect(() => {
    if (!schedule) return;
    const ms = schedule.fireAt.getTime() - Date.now();
    const intervalMs = ms <= 3 * 60 * 1000 ? 1000 : 10_000;
    const id = window.setInterval(() => setTick((x) => x + 1), intervalMs);
    return () => window.clearInterval(id);
  }, [schedule?.fireAt.getTime()]); // eslint-disable-line react-hooks/exhaustive-deps

  const reminderText =
    schedule && baby
      ? formatFeedReminderCardText(schedule, baby.name, locale, (k, p) => t(k, p))
      : null;

  return {
    settings: settings ?? { feedingReminderEnabled: false, feedingReminderMinutes: 180 },
    schedule,
    reminderText,
  };
}
