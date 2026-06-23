'use client';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 accent-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'accent-bg text-white shadow-brand hover:opacity-90 active:opacity-95',
        secondary:
          'bg-white/65 text-brand-text shadow-brand hover:bg-white/80 active:opacity-95',
        outline:
          'border border-brand-cream-bg bg-card text-foreground hover:bg-secondary',
        ghost: 'text-foreground hover:bg-secondary',
        link: 'accent-text underline-offset-4 hover:underline',
        destructive:
          'bg-destructive text-destructive-foreground shadow-brand hover:opacity-90',
      },
      size: {
        sm: 'h-9 rounded-full px-4 text-sm',
        default: 'h-12 rounded-full px-6 text-base min-h-[44px]',
        lg: 'h-14 rounded-full px-7 text-base',
        icon: 'h-10 w-10 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, loading, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
