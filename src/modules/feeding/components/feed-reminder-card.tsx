'use client';

import { Bell } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useFeedingReminder } from '@/hooks/use-feeding-reminder';

export function FeedReminderCard({ babyId }: { babyId: string | null }) {
  const t = useTranslations();
  const { settings, reminderText } = useFeedingReminder(babyId);

  if (!settings.feedingReminderEnabled || !babyId || !reminderText) {
    return null;
  }

  return (
    <section className="mt-6">
      <h3 className="mb-3 px-1 text-base font-bold text-brand-text">{t('home.reminders')}</h3>
      <div className="rounded-brand-lg bg-gradient-to-br from-brand-sage to-brand-soft-blue p-5 shadow-brand">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <Bell className="h-5 w-5 text-white" />
          </span>
          <p className="flex-1 text-sm font-semibold leading-snug text-white">{reminderText}</p>
        </div>
      </div>
    </section>
  );
}
