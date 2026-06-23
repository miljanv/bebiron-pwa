'use client';

import { useLocale } from 'next-intl';
import { useEffect } from 'react';

import { useAuth } from '@/hooks/use-auth';
import { useNotificationSettings } from '@/hooks/use-notification-settings';
import {
  isPushSupported,
  subscribeToPushNotifications,
  syncFeedingReminders,
} from '@/lib/push/client';

export function PushNotificationBootstrap() {
  const { user } = useAuth();
  const locale = useLocale();
  const { data: settings } = useNotificationSettings();

  useEffect(() => {
    if (!user?.id || !settings?.feedingReminderEnabled) return;
    if (!isPushSupported()) return;
    if (Notification.permission !== 'granted') return;

    void (async () => {
      try {
        await subscribeToPushNotifications();
        await syncFeedingReminders(locale);
      } catch {
        /* ignore bootstrap errors */
      }
    })();
  }, [user?.id, settings?.feedingReminderEnabled, locale]);

  return null;
}
