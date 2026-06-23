'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { FormField } from '@/components/forms/form-field';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { sharingService } from '@/services/supabase';
import { type JoinBabyInput, joinBabySchema } from '@/validations/activity.schema';

type Props = {
  open: boolean;
  onClose: () => void;
  initialCode?: string;
};

export function JoinBabyDialog({ open, onClose, initialCode = '' }: Props) {
  const t = useTranslations();
  const qc = useQueryClient();

  const form = useForm<JoinBabyInput>({
    resolver: zodResolver(joinBabySchema),
    defaultValues: { code: initialCode },
  });

  useEffect(() => {
    if (open) form.reset({ code: initialCode });
  }, [open, initialCode, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await sharingService.acceptCode(values.code);
      toast.success(t('settings.joinedBaby'));
      await qc.invalidateQueries({ queryKey: ['babies'] });
      await qc.invalidateQueries({ queryKey: ['activities'] });
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t('settings.codeRejected'));
    }
  });

  const submitting = form.formState.isSubmitting;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent sheet>
        <DialogHeader className="mb-4">
          <DialogTitle>{t('settings.joinBabyTitle')}</DialogTitle>
          <DialogDescription>{t('settings.joinBabyDesc')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="code"
            placeholder={t('settings.codePlaceholder')}
            autoComplete="off"
            className="[&_input]:text-center [&_input]:text-2xl [&_input]:font-extrabold [&_input]:tracking-[0.25em]"
          />
          <Button type="submit" loading={submitting}>
            {t('settings.connect')}
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="text-center text-sm font-semibold text-brand-text-muted hover:text-brand-text"
          >
            {t('common.close')}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
