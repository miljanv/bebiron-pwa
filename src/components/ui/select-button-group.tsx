'use client';

import { cn } from '@/lib/utils/cn';

type Option<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  value: T | null | undefined;
  onChange: (value: T) => void;
  options: ReadonlyArray<Option<T>>;
  className?: string;
  disabled?: boolean;
};

export function SelectButtonGroup<T extends string>({
  value,
  onChange,
  options,
  className,
  disabled,
}: Props<T>) {
  return (
    <div className={cn('flex gap-3', className)} role="radiogroup">
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex-1 rounded-brand py-3.5 text-sm font-semibold border transition-all min-h-[44px]',
              selected
                ? 'accent-bg accent-border text-white shadow-brand'
                : 'border-brand-cream-bg bg-card text-foreground hover:border-brand-text-muted',
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
