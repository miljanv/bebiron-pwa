'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { userService } from '@/services/supabase';
import type { UserNotificationSettings } from '@/types';

import { useAuth } from './use-auth';

const KEY = ['notification-settings'] as const;

export function useNotificationSettings() {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...KEY, user?.id],
    queryFn: () => userService.getNotificationSettings(user!.id),
    enabled: !!user?.id,
    staleTime: 60_000,
  });
}

export function useSaveNotificationSettings() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (partial: Partial<UserNotificationSettings>) =>
      userService.saveNotificationSettings(user!.id, partial),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}
