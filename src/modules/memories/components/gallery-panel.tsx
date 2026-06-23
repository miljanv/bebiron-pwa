'use client';

import { Camera, Download, Trash2, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAuth } from '@/hooks/use-auth';
import { useBabies } from '@/hooks/use-babies';
import {
  useDeleteGalleryPhoto,
  useGallery,
  useUploadGalleryPhoto,
} from '@/hooks/use-gallery';
import { useBabyStore } from '@/stores/use-baby-store';
import { cn } from '@/lib/utils/cn';

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

function bust(url: string, version: number) {
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}t=${version}`;
}

async function compressToJpeg(file: File, maxSize = 1600, quality = 0.85): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    });
    const ratio = Math.min(1, maxSize / Math.max(img.width, img.height));
    const w = Math.round(img.width * ratio);
    const h = Math.round(img.height * ratio);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, w, h);
    return await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => resolve(blob ?? file), 'image/jpeg', quality);
    });
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function GalleryPanel() {
  const t = useTranslations();
  const { user } = useAuth();
  const selectedBabyId = useBabyStore((s) => s.selectedBabyId);
  const { data: babies = [] } = useBabies();
  const selectedBaby = babies.find((b) => b.id === selectedBabyId) ?? null;

  const { data: entries = [], isLoading } = useGallery(selectedBabyId);
  const upload = useUploadGalleryPhoto();
  const remove = useDeleteGalleryPhoto();

  const [galleryVersion, setGalleryVersion] = useState(0);
  const [uploadingMonth, setUploadingMonth] = useState<number | null>(null);
  const [pendingMonth, setPendingMonth] = useState<number | null>(null);
  const [fullScreen, setFullScreen] = useState<{ url: string; month: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pendingUploadMonthRef = useRef<number | null>(null);

  const entriesByMonth = useMemo(() => {
    const map = new Map<number, (typeof entries)[number]>();
    for (const e of entries) map.set(e.month, e);
    return map;
  }, [entries]);

  if (!selectedBabyId) {
    return (
      <div className="px-5 pt-6 text-sm text-brand-text-muted">{t('memories.selectBabyGallery')}</div>
    );
  }

  const handleCellPress = (month: number) => {
    const entry = entriesByMonth.get(month);
    if (entry?.imageUrl) {
      setFullScreen({ url: bust(entry.imageUrl, galleryVersion), month });
      return;
    }
    pendingUploadMonthRef.current = month;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const month = pendingUploadMonthRef.current;
    pendingUploadMonthRef.current = null;
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || month == null || !user?.id || !selectedBabyId) return;
    setUploadingMonth(month);
    try {
      const blob = await compressToJpeg(file);
      await upload.mutateAsync({ userId: user.id, babyId: selectedBabyId, month, file: blob });
      setGalleryVersion(Date.now());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('memories.couldNotUpload'));
    } finally {
      setUploadingMonth(null);
    }
  };

  const handleDelete = async (month: number) => {
    if (!selectedBabyId) return;
    try {
      await remove.mutateAsync({ babyId: selectedBabyId, month, userId: user?.id });
      setFullScreen(null);
      setPendingMonth(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('common.couldNotDelete'));
    }
  };

  const handleDownload = async (url: string, month: number) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const objUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objUrl;
      a.download = `${selectedBaby?.name ?? 'beba'}-${month}-mesec.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objUrl);
      toast.success(t('memories.photoSaved'));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t('memories.couldNotSavePhoto'));
    }
  };

  return (
    <div className="px-5">
      {selectedBaby ? (
        <p className="mb-5 text-sm text-brand-text-muted">
          {t('memories.gallerySubtitle', { name: selectedBaby.name })}
        </p>
      ) : null}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 pb-8 md:grid-cols-3 lg:grid-cols-4">
          {MONTHS.map((month) => {
            const entry = entriesByMonth.get(month) ?? null;
            const hasImage = !!entry?.imageUrl;
            const isUploading = uploadingMonth === month;
            return (
              <button
                key={month}
                type="button"
                onClick={() => handleCellPress(month)}
                disabled={isUploading}
                className={cn(
                  'relative aspect-square w-full overflow-hidden rounded-brand-md bg-card shadow-brand transition hover:opacity-95',
                )}
              >
                {hasImage ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={bust(entry!.imageUrl, galleryVersion)}
                      alt={`Month ${month}`}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPendingMonth(month);
                      }}
                      className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-destructive text-white shadow"
                      aria-label={t('memories.deletePhoto')}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-border">
                    <Camera className="h-6 w-6 text-brand-text-muted" />
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 accent-bg py-1 text-center text-xs font-semibold text-white">
                  {t('common.month', { n: month })}
                </div>

                {isUploading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <LoadingSpinner size={20} className="text-white" />
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      )}

      {fullScreen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          role="dialog"
          aria-modal
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fullScreen.url}
            alt={`Month ${fullScreen.month}`}
            className="max-h-full max-w-full object-contain"
          />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-black/50 px-4 pb-3 pt-safe">
            <p className="text-lg font-bold text-white">
              {t('common.month', { n: fullScreen.month })}
            </p>
            <button
              type="button"
              onClick={() => setFullScreen(null)}
              className="rounded-full p-2 text-white"
              aria-label={t('common.close')}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex justify-center gap-4 bg-black/50 px-6 py-6 pb-safe">
            <button
              type="button"
              onClick={() => handleDownload(fullScreen.url, fullScreen.month)}
              className="flex items-center gap-2 rounded-brand-md bg-white/20 px-5 py-3 text-sm font-semibold text-white"
            >
              <Download className="h-5 w-5" /> {t('memories.download')}
            </button>
            <button
              type="button"
              onClick={() => setPendingMonth(fullScreen.month)}
              className="flex items-center gap-2 rounded-brand-md bg-destructive px-5 py-3 text-sm font-semibold text-white"
            >
              <Trash2 className="h-5 w-5" /> {t('common.delete')}
            </button>
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        open={pendingMonth != null}
        title={t('memories.deletePhoto')}
        description={t('memories.deletePhotoConfirm', { month: pendingMonth ?? 0 })}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        destructive
        loading={remove.isPending}
        onOpenChange={(v) => !v && setPendingMonth(null)}
        onConfirm={() => pendingMonth && handleDelete(pendingMonth)}
      />
    </div>
  );
}
