'use client';

import { Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAuth } from '@/hooks/use-auth';
import { SITE_URL } from '@/constants';
import { sharingService } from '@/services/supabase';
import type { Baby } from '@/types';

type Props = {
  open: boolean;
  baby: Baby | null;
  onClose: () => void;
};

export function ShareBabyDialog({ open, baby, onClose }: Props) {
  const t = useTranslations();
  const { user } = useAuth();
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !baby || !user?.id) {
      setCode(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    sharingService
      .createInvite(baby.id, user.id)
      .then((invite) => {
        if (!cancelled) setCode(invite.code);
      })
      .catch((e) => {
        if (!cancelled) {
          toast.error(e instanceof Error ? e.message : t('settings.codeNotCreated'));
          onClose();
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, baby?.id, user?.id, baby, onClose, t]);

  const origin = typeof window !== 'undefined' ? window.location.origin : SITE_URL;
  const deepLink = code ? sharingService.getDeepLink(code, origin) : '';

  const onCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      toast.success(t('settings.copied'));
    } catch {
      toast.error(t('common.couldNotSave'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('settings.shareAccess')}</DialogTitle>
          <DialogDescription>
            {t('settings.shareForBaby', { name: baby?.name ?? '' })}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col items-center">
          {loading ? (
            <div className="py-10">
              <LoadingSpinner size={32} />
            </div>
          ) : code ? (
            <>
              <div className="rounded-brand-md bg-white p-4">
                <QRCodeSVG value={deepLink} size={180} />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-brand-text-muted">
                {t('settings.shareCode')}
              </p>
              <p className="mt-1 select-all text-2xl font-extrabold tracking-[0.25em] text-brand-text">
                {code}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onCopy}
                className="mt-2 gap-2"
              >
                <Copy className="h-4 w-4" />
                {t('settings.copy')}
              </Button>
              <p className="mt-3 max-w-[260px] text-center text-xs text-brand-text-muted">
                {t('settings.shareCodeHint')}
              </p>
            </>
          ) : null}

          <Button type="button" onClick={onClose} className="mt-6 w-full">
            {t('common.close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
