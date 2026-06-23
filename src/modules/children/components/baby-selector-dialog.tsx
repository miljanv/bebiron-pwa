'use client';

import { Baby as BabyIcon, Link2, Pencil, Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MAX_OWNED_BABIES } from '@/constants';
import { useDeleteBaby } from '@/hooks/use-babies';
import { useBabyStore } from '@/stores/use-baby-store';
import { cn } from '@/lib/utils/cn';
import { getLocalizedAgeString } from '@/lib/utils/activity';
import type { Baby } from '@/types';

import { ShareBabyDialog } from './share-baby-dialog';

type Props = {
  open: boolean;
  babies: Baby[];
  onClose: () => void;
  onAddBaby: () => void;
  onEditBaby: (baby: Baby) => void;
};

export function BabySelectorDialog({ open, babies, onClose, onAddBaby, onEditBaby }: Props) {
  const t = useTranslations();
  const selectedBabyId = useBabyStore((s) => s.selectedBabyId);
  const setSelectedBabyId = useBabyStore((s) => s.setSelectedBabyId);
  const deleteBaby = useDeleteBaby();

  const [shareBaby, setShareBaby] = useState<Baby | null>(null);
  const [pendingDeleteBaby, setPendingDeleteBaby] = useState<Baby | null>(null);

  const ownedCount = useMemo(() => babies.filter((b) => b.isOwner === true).length, [babies]);
  const canAddOwned = ownedCount < MAX_OWNED_BABIES;

  const handleSelect = (id: string) => {
    setSelectedBabyId(id);
    onClose();
  };

  const handleDelete = (b: Baby) => {
    if (!b.isOwner) {
      toast(t('home.onlyOwnerCanDelete'));
      return;
    }
    setPendingDeleteBaby(b);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteBaby) return;
    try {
      await deleteBaby.mutateAsync(pendingDeleteBaby.id);
      setPendingDeleteBaby(null);
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t('common.couldNotDelete'));
    }
  };

  const handleAdd = () => {
    if (!canAddOwned) {
      toast(t('home.babyLimitMessage', { max: MAX_OWNED_BABIES }));
      return;
    }
    onClose();
    onAddBaby();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent>
          <DialogHeader className="mb-4">
            <DialogTitle>{t('home.selectBabyModal')}</DialogTitle>
          </DialogHeader>

          <ul className="flex flex-col gap-2">
            {babies.map((b) => (
              <li
                key={b.id}
                className={cn(
                  'flex items-center gap-3 rounded-brand-md border bg-secondary px-3 py-2',
                  selectedBabyId === b.id
                    ? 'accent-border ring-1 accent-ring'
                    : 'border-transparent',
                )}
              >
                <button
                  type="button"
                  onClick={() => handleSelect(b.id)}
                  className="flex flex-1 items-center gap-3 text-left"
                >
                  {b.avatarUri ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={b.avatarUri} alt={b.name} className="h-11 w-11 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-border">
                      <BabyIcon className="h-5 w-5 accent-text" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-bold text-brand-text">{b.name}</p>
                    <p className="truncate text-xs text-brand-text-muted">
                      {getLocalizedAgeString(b.birthDate, t)}
                      {b.isOwner === false ? t('home.sharedAccess') : ''}
                    </p>
                  </div>
                </button>
                {b.isOwner !== false ? (
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setShareBaby(b)}
                      className="rounded-full p-2 accent-text hover:bg-card"
                      aria-label={t('settings.shareAccess')}
                    >
                      <Link2 className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditBaby(b)}
                      className="rounded-full p-2 accent-text hover:bg-card"
                      aria-label={t('home.editBaby')}
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(b)}
                      className="rounded-full p-2 text-destructive hover:bg-card"
                      aria-label={t('home.deleteBaby')}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>

          <Button
            type="button"
            onClick={handleAdd}
            disabled={!canAddOwned}
            className="mt-4 w-full gap-2"
          >
            <Plus className="h-5 w-5" />
            {t('home.addBabyLimit', { count: ownedCount, max: MAX_OWNED_BABIES })}
          </Button>

          <button
            type="button"
            onClick={onClose}
            className="mt-3 text-center text-sm font-semibold text-brand-text-muted hover:text-brand-text"
          >
            {t('common.close')}
          </button>
        </DialogContent>
      </Dialog>

      <ShareBabyDialog
        open={shareBaby != null}
        baby={shareBaby}
        onClose={() => setShareBaby(null)}
      />

      <ConfirmDialog
        open={pendingDeleteBaby != null}
        title={t('home.deleteBaby')}
        description={t('home.deleteBabyConfirm', { name: pendingDeleteBaby?.name ?? '' })}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        destructive
        loading={deleteBaby.isPending}
        onOpenChange={(v) => !v && setPendingDeleteBaby(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
