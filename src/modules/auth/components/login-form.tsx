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
import { Link, useRouter } from '@/lib/i18n/navigation';
import { authService } from '@/services/supabase/auth.service';
import { type LoginInput, loginSchema } from '@/validations/auth.schema';

export function LoginForm() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onSubmit',
  });

  const onSubmit = form.handleSubmit(async ({ email, password }) => {
    setServerError(null);
    const { error } = await authService.signIn(email.trim(), password);
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
        <AppIcon size={80} />
        <h1 className="mt-5 text-3xl font-extrabold text-brand-text">{t('auth.welcomeBack')}</h1>
        <p className="mt-2 text-base text-brand-text-muted">{t('auth.loginSubtitle')}</p>
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
          autoComplete="current-password"
          placeholder={t('auth.passwordPlaceholder')}
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

        {serverError ? (
          <p className="text-center text-sm text-destructive" role="alert">
            {serverError}
          </p>
        ) : null}

        <Button type="submit" loading={isSubmitting} className="mt-2">
          {t('auth.signIn')}
        </Button>

        <div className="mt-2 text-center text-sm">
          <Link href="/forgot-password" className="font-semibold accent-text">
            {t('auth.forgotPassword')}
          </Link>
        </div>
      </form>

      <p className="mt-7 text-center text-sm text-brand-text-muted">
        {t('auth.noAccount')}{' '}
        <Link href="/register" className="font-semibold accent-text">
          {t('auth.signUp')}
        </Link>
      </p>
    </div>
  );
}
