'use client';

import { ArrowLeft } from 'lucide-react';

import { Link, useRouter } from '@/lib/i18n/navigation';
import { cn } from '@/lib/utils/cn';

type Props = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  backHref?: string;
  right?: React.ReactNode;
  className?: string;
};

export function PageHeader({ title, subtitle, showBack, backHref, right, className }: Props) {
  const router = useRouter();
  const renderBack = showBack || backHref;
  const backButton = (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-card text-foreground shadow-brand hover:opacity-90"
      aria-hidden
    >
      <ArrowLeft className="h-5 w-5" />
    </span>
  );

  return (
    <header className={cn('flex items-start gap-3', className)}>
      {renderBack ? (
        backHref ? (
          <Link href={backHref} aria-label="Back" className="contents">
            {backButton}
          </Link>
        ) : (
          <button type="button" onClick={() => router.back()} aria-label="Back" className="contents">
            {backButton}
          </button>
        )
      ) : null}
      <div className="flex-1">
        <h1 className="text-2xl font-bold leading-tight">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-brand-text-muted">{subtitle}</p> : null}
      </div>
      {right}
    </header>
  );
}
