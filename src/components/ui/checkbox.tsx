'use client';

import { Check } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils/cn';

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  onCheckedChange?: (checked: boolean) => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export const Checkbox = React.forwardRef<HTMLInputElement, Props>(
  ({ className, checked, onCheckedChange, onChange, ...props }, ref) => {
    return (
      <label className={cn('relative inline-flex shrink-0 cursor-pointer', className)}>
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          className="peer sr-only"
          onChange={(e) => {
            onCheckedChange?.(e.target.checked);
            onChange?.(e);
          }}
          {...props}
        />
        <span
          aria-hidden
          className={cn(
            'flex h-5 w-5 items-center justify-center rounded-md border-[1.5px] border-brand-cream bg-card transition-colors peer-checked:accent-bg peer-checked:accent-border peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 accent-ring',
          )}
        >
          {checked && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
        </span>
      </label>
    );
  },
);
Checkbox.displayName = 'Checkbox';
