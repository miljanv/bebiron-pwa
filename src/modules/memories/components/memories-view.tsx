'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { GalleryPanel } from './gallery-panel';
import { MusicPanel } from './music-panel';
import { cn } from '@/lib/utils/cn';

type Tab = 'gallery' | 'music';

export function MemoriesView() {
  const t = useTranslations();
  const [tab, setTab] = useState<Tab>('gallery');

  return (
    <div className="mx-auto w-full max-w-5xl pb-12">
      <header className="px-5 pt-safe lg:pt-8">
        <div className="pt-6">
          <h1 className="text-2xl font-bold text-brand-text">{t('memories.title')}</h1>
          <div
            role="tablist"
            className="mt-4 inline-flex rounded-full border border-border bg-card p-1 shadow-brand"
          >
            <TabButton active={tab === 'gallery'} onClick={() => setTab('gallery')}>
              {t('memories.gallery')}
            </TabButton>
            <TabButton active={tab === 'music'} onClick={() => setTab('music')}>
              {t('memories.music')}
            </TabButton>
          </div>
        </div>
      </header>

      <div className="mt-6">{tab === 'gallery' ? <GalleryPanel /> : <MusicPanel />}</div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      role="tab"
      type="button"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'rounded-full px-4 py-2 text-sm font-semibold transition',
        active ? 'accent-bg text-white shadow-brand' : 'text-brand-text-muted hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}
