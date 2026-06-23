'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { FormField } from '@/components/forms/form-field';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCreateBaby, useUpdateBaby } from '@/hooks/use-babies';
import { formatLocalDate } from '@/lib/utils/datetime';
import type { Baby } from '@/types';
import { type BabyFormInput, babyFormSchema } from '@/validations/baby.schema';

type Props = {
  open: boolean;
  baby: Baby | null;
  onClose: () => void;
};

export function AddEditBabyDialog({ open, baby, onClose }: Props) {
  const t = useTranslations();
  const createBaby = useCreateBaby();
  const updateBaby = useUpdateBaby();

  const form = useForm<BabyFormInput>({
    resolver: zodResolver(babyFormSchema),
    defaultValues: { name: '', birthDate: formatLocalDate(new Date()) },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: baby?.name ?? '',
        birthDate: baby?.birthDate ?? formatLocalDate(new Date()),
      });
    }
  }, [open, baby?.id, baby?.name, baby?.birthDate, baby, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (baby) {
        await updateBaby.mutateAsync({
          id: baby.id,
          updates: { name: values.name.trim(), birthDate: values.birthDate },
        });
      } else {
        await createBaby.mutateAsync({ name: values.name.trim(), birthDate: values.birthDate });
      }
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t('common.couldNotSave'));
    }
  });

  const isEdit = !!baby;
  const submitting = form.formState.isSubmitting || createBaby.isPending || updateBaby.isPending;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent sheet>
        <DialogHeader className="mb-4">
          <DialogTitle>{isEdit ? t('home.editBaby') : t('home.addBaby')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="name"
            label={t('common.name')}
            placeholder={t('home.babyName')}
            disabled={submitting}
          />
          <FormField
            control={form.control}
            name="birthDate"
            label={t('home.birthDate')}
            type="date"
            disabled={submitting}
          />
          <Button type="submit" loading={submitting} className="mt-2">
            {isEdit ? t('common.save') : t('common.add')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
