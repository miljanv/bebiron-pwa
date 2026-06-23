import { Heart, Moon, Star } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { SleepingBabyIllustration } from '@/components/shared/sleeping-baby-illustration';
import { Button } from '@/components/ui/button';
import { Link } from '@/lib/i18n/navigation';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function WelcomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center pb-12 pt-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <Star className="absolute left-8 top-20 h-6 w-6 text-brand-sage/30" />
        <Moon className="absolute right-12 top-32 h-8 w-8 text-brand-soft-blue/30" />
        <Heart className="absolute bottom-40 left-12 h-6 w-6 text-brand-sage/30" />
        <Star className="absolute right-8 top-1/4 h-4 w-4 text-brand-soft-blue/30" />
      </div>

      <div className="z-10 flex w-full max-w-sm flex-col items-center text-center">
        <h1 className="text-balance text-4xl font-extrabold tracking-tight text-brand-text">
          {t('auth.brand')}
        </h1>
        <p className="mt-3 max-w-[280px] text-base text-brand-text-muted">{t('auth.tagline')}</p>

        <div className="my-12 flex h-64 w-64 items-center justify-center rounded-full bg-gradient-to-br from-brand-mint/40 to-brand-soft-blue/40">
          <SleepingBabyIllustration size={192} />
        </div>

        <div className="flex w-full flex-col gap-3">
          <LanguageSwitcher variant="auth" />
          <Button asChild>
            <Link href="/register">{t('auth.getStarted')}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/login">{t('auth.alreadyHaveAccount')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
