'use client';

import { useTranslations } from 'next-intl';
import * as React from 'react';
import { Controller, type FieldValues, type UseControllerProps } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils/cn';

function translateMessage(message: string | undefined, t: ReturnType<typeof useTranslations>) {
  if (!message) return undefined;
  if (message.includes('.')) {
    try {
      return t(message);
    } catch {
      return message;
    }
  }
  return message;
}

type Props<T extends FieldValues> = UseControllerProps<T> & {
  label?: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  rightSlot?: React.ReactNode;
  className?: string;
  description?: string;
};

export function FormField<T extends FieldValues>({
  label,
  type = 'text',
  placeholder,
  autoComplete,
  disabled,
  inputMode,
  rightSlot,
  className,
  description,
  ...controller
}: Props<T>) {
  const t = useTranslations();
  return (
    <Controller
      {...controller}
      render={({ field, fieldState }) => {
        const message = translateMessage(fieldState.error?.message, t);
        const id = `field-${String(controller.name)}`;
        return (
          <div className={cn('flex flex-col gap-2', className)}>
            {label ? <Label htmlFor={id}>{label}</Label> : null}
            <div className="relative">
              <Input
                id={id}
                type={type}
                placeholder={placeholder}
                autoComplete={autoComplete}
                disabled={disabled}
                inputMode={inputMode}
                aria-invalid={!!fieldState.error}
                {...field}
                value={field.value ?? ''}
                className={cn(rightSlot ? 'pr-12' : '', fieldState.error ? 'border-destructive' : '')}
              />
              {rightSlot ? (
                <div className="absolute inset-y-0 right-2 flex items-center">{rightSlot}</div>
              ) : null}
            </div>
            {description ? (
              <p className="text-xs text-brand-text-muted">{description}</p>
            ) : null}
            {message ? (
              <p className="text-xs text-destructive">{message}</p>
            ) : null}
          </div>
        );
      }}
    />
  );
}
