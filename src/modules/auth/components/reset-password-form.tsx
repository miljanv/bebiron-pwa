'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { FormField } from '@/components/forms/form-field';
import { AppIcon } from '@/components/shared/app-icon';
import { Button } from '@/components/ui/button';
import { translateAuthError } from '@/lib/i18n/auth-errors';
import type { Locale } from '@/lib/i18n/config';
import { useRouter } from '@/lib/i18n/navigation';
import { authService } from '@/services/supabase/auth.service';
import {
  type ResetPasswordInput,
  resetPasswordSchema,
} from '@/validations/auth.schema';

export function ResetPasswordForm() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = form.handleSubmit(async ({ password }) => {
    setServerError(null);
    const { error } = await authService.updatePassword(password);
    if (error) {
      setServerError(translateAuthError(error.message, locale as Locale));
      return;
    }
    router.replace('/home');
    router.refresh();
  });

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 flex flex-col items-center text-center">
        <AppIcon size={72} />
        <h1 className="mt-4 text-3xl font-extrabold text-brand-text">
          {t('auth.resetPasswordTitle')}
        </h1>
        <p className="mt-2 text-base text-brand-text-muted">
          {t('auth.resetPasswordSubtitle')}
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex w-full flex-col gap-4" noValidate>
        <FormField
          name="password"
          control={form.control}
          label={t('auth.newPassword')}
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder={t('auth.createPassword')}
          disabled={isSubmitting}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="flex h-8 w-8 items-center justify-center rounded-full text-brand-text-muted"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          }
        />

        <FormField
          name="confirmPassword"
          control={form.control}
          label={t('auth.confirmPassword')}
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder={t('auth.repeatPassword')}
          disabled={isSubmitting}
        />

        {serverError ? (
          <p className="text-center text-sm text-destructive" role="alert">
            {serverError}
          </p>
        ) : null}

        <Button type="submit" loading={isSubmitting} className="mt-2">
          {t('common.save')}
        </Button>
      </form>
    </div>
  );
}
