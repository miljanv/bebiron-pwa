'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocale } from 'next-intl';

import { syncFeedingReminders } from '@/lib/push/client';
import { activityService } from '@/services/supabase';
import type { NewActivity } from '@/types';

import { useBabies } from './use-babies';

export const ACTIVITIES_KEY = ['activities'] as const;

export function useActivities() {
  const { data: babies } = useBabies();
  const ids = babies?.map((b) => b.id) ?? [];
  return useQuery({
    queryKey: [...ACTIVITIES_KEY, ids.join(',')],
    queryFn: () => activityService.listForBabies(ids),
    enabled: ids.length > 0,
    staleTime: 15_000,
  });
}

export function useCreateActivity() {
  const qc = useQueryClient();
  const locale = useLocale();
  return useMutation({
    mutationFn: (input: NewActivity) => activityService.create(input),
    onSuccess: (activity) => {
      qc.invalidateQueries({ queryKey: ACTIVITIES_KEY });
      if (activity.type === 'feed') {
        void syncFeedingReminders(locale);
      }
    },
  });
}

export function useDeleteActivity() {
  const qc = useQueryClient();
  const locale = useLocale();
  return useMutation({
    mutationFn: (id: string) => activityService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ACTIVITIES_KEY });
      void syncFeedingReminders(locale);
    },
  });
}
