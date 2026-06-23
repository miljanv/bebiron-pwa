'use client';

import { Baby as BabyIcon, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { getLocalizedAgeString } from '@/lib/utils/activity';
import type { Baby } from '@/types';

type Props = {
  selectedBaby: Baby | null | undefined;
  onOpen: () => void;
};

export function BabyHeader({ selectedBaby, onOpen }: Props) {
  const t = useTranslations();

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-4 rounded-brand-lg bg-card p-5 text-left shadow-brand transition hover:opacity-95"
    >
      <div className="flex-shrink-0">
        {selectedBaby?.avatarUri ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={selectedBaby.avatarUri}
            alt={selectedBaby.name}
            className="h-20 w-20 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-soft-blue">
            <BabyIcon className="h-9 w-9 text-white" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xl font-bold text-brand-text">
          {selectedBaby?.name ?? t('home.selectBaby')}
        </p>
        <p className="truncate text-sm text-brand-text-muted">
          {selectedBaby ? getLocalizedAgeString(selectedBaby.birthDate, t) : t('home.addOrEditBaby')}
        </p>
      </div>
      <ChevronDown className="ml-2 h-6 w-6 accent-text" />
    </button>
  );
}
