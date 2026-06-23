'use client';

import { BookOpen, Heart, Home, Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { AppIcon } from '@/components/shared/app-icon';
import { Link, usePathname } from '@/lib/i18n/navigation';
import { cn } from '@/lib/utils/cn';

const items = [
  { href: '/home', icon: Home, labelKey: 'tabs.home' },
  { href: '/memories', icon: Heart, labelKey: 'tabs.memories' },
  { href: '/help', icon: BookOpen, labelKey: 'help.menuTitle' },
  { href: '/settings', icon: Settings, labelKey: 'tabs.settings' },
] as const;

export function DesktopSidebar({ hidden }: { hidden?: boolean }) {
  const t = useTranslations();
  const pathname = usePathname();
  if (hidden) return null;
  return (
    <aside className="sticky top-0 hidden h-dvh w-72 shrink-0 border-r border-border bg-card lg:flex lg:flex-col">
      <div className="flex items-center gap-3 px-6 pt-8">
        <AppIcon size={44} />
        <div>
          <p className="text-lg font-bold tracking-tight">{t('auth.brand')}</p>
          <p className="text-xs text-brand-text-muted">{t('auth.tagline')}</p>
        </div>
      </div>
      <nav className="mt-10 flex-1 px-3" aria-label="Primary">
        <ul className="flex flex-col gap-1">
          {items.map(({ href, icon: Icon, labelKey }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-3 rounded-brand-md px-3 py-3 text-sm font-semibold transition-colors',
                    isActive
                      ? 'accent-bg text-white shadow-brand'
                      : 'text-foreground hover:bg-secondary',
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{t(labelKey)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
