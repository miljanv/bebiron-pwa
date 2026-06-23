'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { galleryService } from '@/services/supabase';

export function useGallery(babyId: string | null) {
  return useQuery({
    queryKey: ['gallery', babyId],
    queryFn: () => galleryService.list(babyId!),
    enabled: !!babyId,
    staleTime: 60_000,
  });
}

export function useUploadGalleryPhoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      babyId,
      month,
      file,
    }: {
      userId: string;
      babyId: string;
      month: number;
      file: Blob;
    }) => galleryService.upload(userId, babyId, month, file),
    onSuccess: (_, { babyId }) => {
      qc.invalidateQueries({ queryKey: ['gallery', babyId] });
    },
  });
}

export function useDeleteGalleryPhoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      babyId,
      month,
      userId,
    }: {
      babyId: string;
      month: number;
      userId?: string;
    }) => galleryService.delete(babyId, month, userId),
    onSuccess: (_, { babyId }) => {
      qc.invalidateQueries({ queryKey: ['gallery', babyId] });
    },
  });
}
