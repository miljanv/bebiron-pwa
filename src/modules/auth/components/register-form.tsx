'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { FormField } from '@/components/forms/form-field';
import { AppIcon } from '@/components/shared/app-icon';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { translateAuthError } from '@/lib/i18n/auth-errors';
import type { Locale } from '@/lib/i18n/config';
import { Link, useRouter } from '@/lib/i18n/navigation';
import { authService } from '@/services/supabase/auth.service';
import { type RegisterInput, registerSchema } from '@/validations/auth.schema';

export function RegisterForm() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '', agreedToTerms: false },
    mode: 'onSubmit',
  });

  const onSubmit = form.handleSubmit(async ({ email, password }) => {
    setServerError(null);
    const { error } = await authService.signUp(email.trim(), password);
    if (error) {
      setServerError(translateAuthError(error.message, locale as Locale));
      return;
    }
    router.replace('/home');
    router.refresh();
  });

  const isSubmitting = form.formState.isSubmitting;
  const termsError = form.formState.errors.agreedToTerms?.message;

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-6 flex flex-col items-center text-center">
        <AppIcon size={70} />
        <h1 className="mt-4 text-3xl font-extrabold text-brand-text">
          {t('auth.createAccountTitle')}
        </h1>
        <p className="mt-2 text-base text-brand-text-muted">{t('auth.createAccountSubtitle')}</p>
      </div>

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

        <FormField
          name="password"
          control={form.control}
          label={t('common.password')}
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
          type={showConfirmPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder={t('auth.repeatPassword')}
          disabled={isSubmitting}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              className="flex h-8 w-8 items-center justify-center rounded-full text-brand-text-muted"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          }
        />

        <Controller
          control={form.control}
          name="agreedToTerms"
          render={({ field }) => (
            <label className="flex items-start gap-3 text-sm text-brand-text-muted">
              <Checkbox
                checked={field.value}
                onCheckedChange={(v) => field.onChange(Boolean(v))}
                disabled={isSubmitting}
                className="mt-0.5"
              />
              <span className="leading-relaxed">
                {t('auth.termsPrefix')}{' '}
                <span className="font-semibold accent-text">{t('auth.termsOfUse')}</span>{' '}
                {t('auth.termsAnd')}{' '}
                <span className="font-semibold accent-text">{t('auth.privacyPolicy')}</span>
              </span>
            </label>
          )}
        />
        {termsError ? (
          <p className="-mt-2 text-xs text-destructive">
            {(() => {
              const key = termsError as string;
              try {
                return t(key);
              } catch {
                return key;
              }
            })()}
          </p>
        ) : null}

        {serverError ? (
          <p className="text-center text-sm text-destructive" role="alert">
            {serverError}
          </p>
        ) : null}

        <Button type="submit" loading={isSubmitting} className="mt-2">
          {t('auth.createAccount')}
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-brand-text-muted">
        {t('auth.hasAccount')}{' '}
        <Link href="/login" className="font-semibold accent-text">
          {t('auth.signIn')}
        </Link>
      </p>
    </div>
  );
}
