'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { childService } from '@/services/supabase';
import type { Baby } from '@/types';

import { useAuth } from './use-auth';

export const BABIES_KEY = ['babies'] as const;

export function useBabies() {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...BABIES_KEY, user?.id],
    queryFn: () => childService.list(user!.id),
    enabled: !!user?.id,
    staleTime: 30_000,
  });
}

export function useCreateBaby() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<Baby, 'id'>) => childService.create(user!.id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BABIES_KEY });
    },
  });
}

export function useUpdateBaby() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Omit<Baby, 'id'>> }) =>
      childService.update(id, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BABIES_KEY });
    },
  });
}

export function useDeleteBaby() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => childService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BABIES_KEY });
      qc.invalidateQueries({ queryKey: ['activities'] });
    },
  });
}
