'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';
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
import { Label } from '@/components/ui/label';
import { SelectButtonGroup } from '@/components/ui/select-button-group';
import { FEED_TYPE_OPTIONS } from '@/constants';
import { useCreateActivity } from '@/hooks/use-activities';
import { formatLocalDate, formatLocalTime } from '@/lib/utils/datetime';
import type { ActivityType, DiaperType, NewActivity } from '@/types';
import {
  diaperActivitySchema,
  type DiaperActivityInput,
  feedActivitySchema,
  type FeedActivityInput,
  sleepActivitySchema,
  type SleepActivityInput,
} from '@/validations/activity.schema';

type Props = {
  open: boolean;
  activityType: ActivityType;
  babyId: string;
  onClose: () => void;
};

function FeedForm({ babyId, onClose }: { babyId: string; onClose: () => void }) {
  const t = useTranslations();
  const createActivity = useCreateActivity();

  const form = useForm<FeedActivityInput>({
    resolver: zodResolver(feedActivitySchema),
    defaultValues: {
      date: formatLocalDate(new Date()),
      time: formatLocalTime(new Date()),
      quantityMl: undefined as unknown as number,
      feedType: FEED_TYPE_OPTIONS[0].value,
    },
  });

  const feedType = form.watch('feedType');

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const payload: NewActivity = {
        babyId,
        type: 'feed',
        date: values.date,
        time: values.time,
        quantityMl: values.quantityMl,
        feedType: values.feedType,
      };
      await createActivity.mutateAsync(payload);
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t('home.couldNotSaveActivity'));
    }
  });

  const isSubmitting = form.formState.isSubmitting || createActivity.isPending;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <FormField control={form.control} name="date" label={t('common.date')} type="date" />
      <FormField control={form.control} name="time" label={t('common.time')} type="time" />
      <FormField
        control={form.control}
        name="quantityMl"
        label={t('home.quantityMl')}
        type="number"
        inputMode="numeric"
        placeholder={t('home.quantityExample')}
      />
      <div className="flex flex-col gap-2">
        <Label>{t('common.type')}</Label>
        <SelectButtonGroup
          value={feedType}
          onChange={(v) => form.setValue('feedType', v)}
          options={FEED_TYPE_OPTIONS.map((o) => ({ value: o.value, label: t(o.labelKey) }))}
        />
      </div>
      <Button type="submit" loading={isSubmitting} className="mt-2">
        {t('common.save')}
      </Button>
    </form>
  );
}

function SleepForm({ babyId, onClose }: { babyId: string; onClose: () => void }) {
  const t = useTranslations();
  const createActivity = useCreateActivity();

  const form = useForm<SleepActivityInput>({
    resolver: zodResolver(sleepActivitySchema),
    defaultValues: {
      date: formatLocalDate(new Date()),
      startTime: formatLocalTime(new Date()),
      endTime: formatLocalTime(new Date()),
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const payload: NewActivity = {
        babyId,
        type: 'sleep',
        date: values.date,
        startTime: values.startTime,
        endTime: values.endTime,
      };
      await createActivity.mutateAsync(payload);
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t('home.couldNotSaveActivity'));
    }
  });

  const isSubmitting = form.formState.isSubmitting || createActivity.isPending;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <FormField control={form.control} name="date" label={t('common.date')} type="date" />
      <FormField control={form.control} name="startTime" label={t('common.start')} type="time" />
      <FormField control={form.control} name="endTime" label={t('common.end')} type="time" />
      <Button type="submit" loading={isSubmitting} className="mt-2">
        {t('common.save')}
      </Button>
    </form>
  );
}

function DiaperForm({ babyId, onClose }: { babyId: string; onClose: () => void }) {
  const t = useTranslations();
  const createActivity = useCreateActivity();

  const form = useForm<DiaperActivityInput>({
    resolver: zodResolver(diaperActivitySchema),
    defaultValues: {
      date: formatLocalDate(new Date()),
      time: formatLocalTime(new Date()),
      diaperType: 'wet',
    },
  });

  const diaperType = form.watch('diaperType');

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const payload: NewActivity = {
        babyId,
        type: 'diaper',
        date: values.date,
        time: values.time,
        diaperType: values.diaperType,
      };
      await createActivity.mutateAsync(payload);
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t('home.couldNotSaveActivity'));
    }
  });

  const isSubmitting = form.formState.isSubmitting || createActivity.isPending;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <FormField control={form.control} name="date" label={t('common.date')} type="date" />
      <FormField control={form.control} name="time" label={t('common.time')} type="time" />
      <div className="flex flex-col gap-2">
        <Label>{t('common.type')}</Label>
        <SelectButtonGroup<DiaperType>
          value={diaperType}
          onChange={(v) => form.setValue('diaperType', v)}
          options={[
            { value: 'wet', label: t('home.diaperWet') },
            { value: 'dirty', label: t('home.diaperDirty') },
            { value: 'both', label: t('home.diaperBoth') },
          ]}
        />
      </div>
      <Button type="submit" loading={isSubmitting} className="mt-2">
        {t('common.save')}
      </Button>
    </form>
  );
}

export function ActivityFormDialog({ open, activityType, babyId, onClose }: Props) {
  const t = useTranslations();
  const title = useMemo(() => {
    if (activityType === 'feed') return t('home.activityFeed');
    if (activityType === 'sleep') return t('home.activitySleep');
    return t('home.activityDiaper');
  }, [activityType, t]);

  // Force remount when type/open changes so RHF state resets cleanly
  useEffect(() => {
    return;
  }, [open, activityType]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent sheet>
        <DialogHeader className="mb-4">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {activityType === 'feed' ? (
          <FeedForm key={`feed-${open}`} babyId={babyId} onClose={onClose} />
        ) : activityType === 'sleep' ? (
          <SleepForm key={`sleep-${open}`} babyId={babyId} onClose={onClose} />
        ) : (
          <DiaperForm key={`diaper-${open}`} babyId={babyId} onClose={onClose} />
        )}
      </DialogContent>
    </Dialog>
  );
}
