'use client';

import { Check, ChevronDown, Globe } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LOCALE_STORAGE_KEY } from '@/constants';
import { usePathname, useRouter } from '@/lib/i18n/navigation';
import { routing, type Locale } from '@/lib/i18n/routing';
import { cn } from '@/lib/utils/cn';

type Variant = 'auth' | 'auth-compact' | 'settings';

function localeLabel(code: Locale, t: ReturnType<typeof useTranslations>): string {
  return code === 'sr' ? t('language.serbian') : t('language.english');
}

export function LanguageSwitcher({ variant = 'settings' }: { variant?: Variant }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onSelect = (next: Locale) => {
    if (next === locale) return;

    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      // ignore private mode / blocked storage
    }

    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  const menuItems = () =>
    routing.locales.map((l) => (
      <DropdownMenuItem
        key={l}
        onClick={() => onSelect(l)}
        className="justify-between"
        disabled={pending}
      >
        <span>{localeLabel(l, t)}</span>
        {locale === l ? <Check className="h-4 w-4 accent-text" strokeWidth={2.5} /> : null}
      </DropdownMenuItem>
    ));

  if (variant === 'auth-compact') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            disabled={pending}
            className="inline-flex items-center gap-1.5 rounded-brand-md border border-brand-cream-bg bg-card px-3 py-2 text-sm font-bold text-foreground shadow-brand hover:opacity-95"
          >
            <Globe className="h-4 w-4" />
            <span>{locale === 'sr' ? 'SR' : 'EN'}</span>
            <ChevronDown className="h-4 w-4 text-brand-text-muted" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t('language.label')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {menuItems()}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (variant === 'auth') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            disabled={pending}
            className="flex w-full items-center justify-between gap-3 rounded-brand-md border border-brand-cream-bg bg-card px-3.5 py-3 text-left shadow-brand hover:opacity-95"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-sage/15">
                <Globe className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-xs text-brand-text-muted">{t('language.label')}</p>
                <p className="text-base font-semibold text-foreground">
                  {localeLabel(locale, t)}
                </p>
              </div>
            </div>
            <ChevronDown className="h-5 w-5 text-brand-text-muted" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[14rem]">
          <DropdownMenuLabel>{t('language.label')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {menuItems()}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={pending}
          className={cn(
            'flex w-full max-w-full min-w-0 items-center justify-between gap-2 rounded-brand-md border border-border bg-card px-3 py-3.5 text-left text-sm font-semibold transition-opacity hover:opacity-95 sm:gap-3 sm:px-4',
          )}
        >
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Globe className="h-5 w-5 shrink-0 text-brand-text-muted" />
            <span className="truncate">{localeLabel(locale, t)}</span>
          </div>
          <ChevronDown className="h-5 w-5 shrink-0 text-brand-text-muted" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[14rem]">
        {menuItems()}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
