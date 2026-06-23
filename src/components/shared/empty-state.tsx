import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

type Props = {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({ icon: Icon, title, description, action, className }: Props) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-10 text-center', className)}>
      {Icon ? (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-beige">
          <Icon className="h-7 w-7 text-brand-text-muted" />
        </div>
      ) : null}
      {title ? <p className="text-base font-semibold text-foreground">{title}</p> : null}
      {description ? <p className="max-w-xs text-sm text-brand-text-muted">{description}</p> : null}
      {action}
    </div>
  );
}
