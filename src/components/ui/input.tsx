'use client';

import * as React from 'react';

import { cn } from '@/lib/utils/cn';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'box-border block w-full max-w-full min-w-0 rounded-brand-md border border-brand-cream bg-card px-4 py-3.5 text-base text-brand-text shadow-sm placeholder:text-brand-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 accent-ring disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
