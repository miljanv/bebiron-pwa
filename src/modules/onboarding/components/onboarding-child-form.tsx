'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { FormField } from '@/components/forms/form-field';
import { SelectButtonGroup } from '@/components/ui/select-button-group';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { formatLocalDate, formatLocalTime } from '@/lib/utils/datetime';
import { useCreateBaby } from '@/hooks/use-babies';
import {
  type OnboardingChildInput,
  onboardingChildSchema,
} from '@/validations/baby.schema';

export function OnboardingChildForm({ onSaved }: { onSaved?: () => void }) {
  const t = useTranslations();
  const createBaby = useCreateBaby();

  const form = useForm<OnboardingChildInput>({
    resolver: zodResolver(onboardingChildSchema),
    defaultValues: {
      name: '',
      birthDate: formatLocalDate(new Date()),
      birthTime: formatLocalTime(new Date()),
    },
  });

  const gender = form.watch('gender');

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await createBaby.mutateAsync({
        name: values.name.trim(),
        birthDate: values.birthDate,
        birthTime: values.birthTime,
        gender: values.gender,
      });
      onSaved?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t('home.couldNotAddChild'));
    }
  });

  const isSubmitting = form.formState.isSubmitting || createBaby.isPending;

  return (
    <div className="mx-auto w-full max-w-md px-6 py-6">
      <h1 className="text-2xl font-bold text-brand-text">{t('home.addChild')}</h1>
      <p className="mt-2 text-sm text-brand-text-muted">{t('home.addChildSubtitle')}</p>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-5" noValidate>
        <FormField
          control={form.control}
          name="name"
          label={t('common.name')}
          placeholder={t('home.childName')}
          disabled={isSubmitting}
          autoComplete="off"
        />

        <div className="flex flex-col gap-2">
          <Label>{t('common.gender')}</Label>
          <SelectButtonGroup
            value={gender ?? null}
            onChange={(v) => form.setValue('gender', v as 'male' | 'female')}
            options={[
              { value: 'male', label: t('common.male') },
              { value: 'female', label: t('common.female') },
            ]}
          />
        </div>

        <FormField
          control={form.control}
          name="birthDate"
          label={t('home.birthDate')}
          type="date"
          disabled={isSubmitting}
        />

        <FormField
          control={form.control}
          name="birthTime"
          label={t('home.birthTime')}
          type="time"
          disabled={isSubmitting}
        />

        <Button type="submit" loading={isSubmitting} className="mt-4">
          {t('home.continue')}
        </Button>
      </form>
    </div>
  );
}
