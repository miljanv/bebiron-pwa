import type { Activity, FeedActivity } from '@/types';

import { parseLocalDateTime, formatLocalTime } from './datetime';
import { toGenitive } from './serbian-grammar';

export type FeedReminderSchedule = {
  lastFeedAt: Date;
  fireAt: Date;
  minutesRemaining: number;
};

export function getLastFeedActivity(activities: Activity[], babyId: string): FeedActivity | null {
  let latest: FeedActivity | null = null;
  let latestKey = '';
  for (const a of activities) {
    if (a.babyId !== babyId || a.type !== 'feed') continue;
    const key = `${a.date}T${a.time}`;
    if (!latest || key > latestKey) {
      latest = a;
      latestKey = key;
    }
  }
  return latest;
}

export function getLastFeedAt(activities: Activity[], babyId: string): Date | null {
  const feed = getLastFeedActivity(activities, babyId);
  if (!feed) return null;
  return parseLocalDateTime(feed.date, feed.time);
}

export function computeFeedFireAt(lastFeedAt: Date, delayMinutes: number): Date {
  const delay = Math.max(1, Math.round(delayMinutes));
  return new Date(lastFeedAt.getTime() + delay * 60 * 1000);
}

export function computeFeedReminderSchedule(
  lastFeedAt: Date,
  delayMinutes: number,
  now: Date = new Date(),
): FeedReminderSchedule | null {
  const fireAt = computeFeedFireAt(lastFeedAt, delayMinutes);
  const diffMs = fireAt.getTime() - now.getTime();
  if (diffMs <= 0) return null;
  const minutesRemaining = Math.max(1, Math.ceil(diffMs / 60000));
  return { lastFeedAt, fireAt, minutesRemaining };
}

type Translator = (key: string, params?: Record<string, string | number>) => string;

export function getLocalizedReminderMinutesLabel(
  minutes: number,
  t: Translator,
): string {
  if (minutes === 1) return t('notifications.oneMinute');
  if (minutes >= 2 && minutes <= 4) return t('notifications.minutes2to4', { n: minutes });
  return t('notifications.minutesOther', { n: minutes });
}

export function formatFeedReminderCardText(
  schedule: FeedReminderSchedule,
  babyName: string,
  locale: 'sr' | 'en',
  t: Translator,
): string {
  const time = formatLocalTime(schedule.fireAt);
  const name = locale === 'sr' ? toGenitive(babyName) : babyName;
  const minLabel = getLocalizedReminderMinutesLabel(schedule.minutesRemaining, t);
  return t('notifications.reminderCard', { name, minutes: minLabel, time });
}

export function getReminderNotificationBody(
  babyName: string,
  locale: 'sr' | 'en',
  t: Translator,
): string {
  const name = locale === 'sr' ? toGenitive(babyName) : babyName;
  return t('notifications.reminderBody', { name });
}
