'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { FormField } from '@/components/forms/form-field';
import { AppIcon } from '@/components/shared/app-icon';
import { Button } from '@/components/ui/button';
import { translateAuthError } from '@/lib/i18n/auth-errors';
import type { Locale } from '@/lib/i18n/config';
import { Link } from '@/lib/i18n/navigation';
import { authService } from '@/services/supabase/auth.service';
import {
  type ForgotPasswordInput,
  forgotPasswordSchema,
} from '@/validations/auth.schema';

export function ForgotPasswordForm() {
  const t = useTranslations();
  const locale = useLocale();
  const [serverError, setServerError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = form.handleSubmit(async ({ email }) => {
    setServerError(null);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const { error } = await authService.resetPasswordForEmail(
      email.trim(),
      `${origin}/${locale === 'sr' ? '' : `${locale}/`}reset-password`,
    );
    if (error) {
      setServerError(translateAuthError(error.message, locale as Locale));
      return;
    }
    setSent(true);
  });

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 flex flex-col items-center text-center">
        <AppIcon size={72} />
        <h1 className="mt-4 text-3xl font-extrabold text-brand-text">
          {t('auth.forgotPasswordTitle')}
        </h1>
        <p className="mt-2 text-base text-brand-text-muted">
          {t('auth.forgotPasswordSubtitle')}
        </p>
      </div>

      {sent ? (
        <div className="rounded-brand-md bg-card p-5 text-center shadow-brand">
          <p className="text-base font-semibold text-brand-text">
            {t('auth.resetEmailSent')}
          </p>
          <Link href="/login" className="mt-4 inline-block font-semibold accent-text">
            {t('auth.backToLogin')}
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex w-full flex-col gap-4" noValidate>
          <FormField
            name="email"
            control={form.control}
            label={t('common.email')}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder={t('auth.emailPlaceholder')}
            disabled={isSubmitting}
          />

          {serverError ? (
            <p className="text-center text-sm text-destructive" role="alert">
              {serverError}
            </p>
          ) : null}

          <Button type="submit" loading={isSubmitting} className="mt-2">
            {t('auth.sendResetLink')}
          </Button>

          <Link
            href="/login"
            className="mt-2 text-center text-sm font-semibold text-brand-text-muted hover:text-foreground"
          >
            {t('auth.backToLogin')}
          </Link>
        </form>
      )}
    </div>
  );
}
