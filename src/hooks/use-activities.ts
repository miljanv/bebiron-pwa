'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
  return useMutation({
    mutationFn: (input: NewActivity) => activityService.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ACTIVITIES_KEY });
    },
  });
}

export function useDeleteActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => activityService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ACTIVITIES_KEY });
    },
  });
}
