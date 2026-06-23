'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { LoadingScreen } from '@/components/shared/loading-screen';
import { useRouter } from '@/lib/i18n/navigation';
import { sharingService } from '@/services/supabase';

export function JoinRedirectClient({ code }: { code: string }) {
  const t = useTranslations();
  const router = useRouter();
  const qc = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    sharingService
      .acceptCode(code)
      .then(async () => {
        await qc.invalidateQueries({ queryKey: ['babies'] });
        await qc.invalidateQueries({ queryKey: ['activities'] });
        toast.success(t('settings.joinedBaby'));
        router.replace('/home');
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : t('settings.codeRejected'));
      });
  }, [code, qc, router, t]);

  if (error) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-6 text-center">
        <p className="text-base text-destructive">{error}</p>
      </div>
    );
  }

  return <LoadingScreen />;
}
