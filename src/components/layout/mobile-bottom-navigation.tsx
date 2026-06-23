'use client';

import { Heart, Home, Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link, usePathname } from '@/lib/i18n/navigation';
import { cn } from '@/lib/utils/cn';

const items = [
  { href: '/home', icon: Home, labelKey: 'tabs.home' },
  { href: '/memories', icon: Heart, labelKey: 'tabs.memories' },
  { href: '/settings', icon: Settings, labelKey: 'tabs.settings' },
] as const;

export function MobileBottomNavigation({ hidden }: { hidden?: boolean }) {
  const t = useTranslations();
  const pathname = usePathname();
  if (hidden) return null;
  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-card pb-safe lg:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 pt-2">
        {items.map(({ href, icon: Icon, labelKey }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 py-2 text-xs font-semibold transition-colors',
                  isActive ? 'accent-text' : 'text-brand-text-muted',
                )}
              >
                <Icon className="h-6 w-6" />
                <span>{t(labelKey)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
