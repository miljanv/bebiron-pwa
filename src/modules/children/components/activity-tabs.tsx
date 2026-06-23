'use client';

import { Baby as BabyIcon, Milk, Moon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ACTIVITY_THEME } from '@/constants';
import { cn } from '@/lib/utils/cn';
import type { ActivityType } from '@/types';

type Props = {
  onSelect: (type: ActivityType) => void;
  disabled?: boolean;
};

const TABS = [
  { key: 'feed' as const, labelKey: 'home.food', Icon: Milk },
  { key: 'sleep' as const, labelKey: 'home.activitySleep', Icon: Moon },
  { key: 'diaper' as const, labelKey: 'home.diapers', Icon: BabyIcon },
];

export function ActivityTabs({ onSelect, disabled }: Props) {
  const t = useTranslations();
  return (
    <div className="flex gap-3">
      {TABS.map(({ key, labelKey, Icon }) => {
        const style = ACTIVITY_THEME[key];
        return (
          <button
            key={key}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(key)}
            className={cn(
              'flex flex-1 flex-col items-center gap-2 rounded-brand-md bg-card py-4 shadow-brand transition hover:opacity-95 disabled:opacity-60',
            )}
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: style.bg }}
            >
              <Icon className="h-5 w-5" style={{ color: style.iconOnBg }} />
            </span>
            <span className="text-xs font-semibold text-brand-text">{t(labelKey)}</span>
          </button>
        );
      })}
    </div>
  );
}
