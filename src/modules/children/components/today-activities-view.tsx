'use client';

import { Baby as BabyIcon, Milk, Moon, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ACTIVITY_THEME } from '@/constants';
import { useActivities, useDeleteActivity } from '@/hooks/use-activities';
import { useBabyStore } from '@/stores/use-baby-store';
import { cn } from '@/lib/utils/cn';
import { getActivitySubtitle, getLocalizedActivityTitle } from '@/lib/utils/activity';
import { getLocalTodayString } from '@/lib/utils/datetime';
import type { Activity, ActivityType } from '@/types';

function ActivityIcon({ type }: { type: ActivityType }) {
  const Icon = type === 'feed' ? Milk : type === 'sleep' ? Moon : BabyIcon;
  return <Icon className="h-5 w-5 text-white" />;
}

export function TodayActivitiesView() {
  const t = useTranslations();
  const selectedBabyId = useBabyStore((s) => s.selectedBabyId);
  const { data: activities = [], isLoading } = useActivities();
  const deleteActivity = useDeleteActivity();
  const [pendingDelete, setPendingDelete] = useState<Activity | null>(null);

  const today = getLocalTodayString();
  const filtered = useMemo(
    () => activities.filter((a) => a.babyId === selectedBabyId && a.date === today),
    [activities, selectedBabyId, today],
  );

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteActivity.mutateAsync(pendingDelete.id);
      setPendingDelete(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t('common.couldNotDelete'));
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-12 pt-safe lg:pt-8">
      <PageHeader title={t('home.activitiesToday')} backHref="/home" />

      <div className="mt-6">
        {!selectedBabyId ? (
          <p className="text-sm text-brand-text-muted">{t('home.selectBabyForActivities')}</p>
        ) : isLoading ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <LoadingSpinner size={32} />
            <p className="text-sm text-brand-text-muted">{t('home.loadingActivities')}</p>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-brand-text-muted">{t('home.noActivitiesToday')}</p>
        ) : (
          <div className="overflow-hidden rounded-brand-lg bg-card shadow-brand">
            {filtered.map((a, i) => {
              const style = ACTIVITY_THEME[a.type];
              return (
                <div
                  key={a.id}
                  className={cn(
                    'flex items-center gap-4 px-4 py-4',
                    i !== filtered.length - 1 && 'border-b border-border',
                  )}
                >
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-full"
                    style={{ backgroundColor: style.bg }}
                  >
                    <ActivityIcon type={a.type} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-brand-text">
                      {getLocalizedActivityTitle(a, t)}
                    </p>
                    <p className="truncate text-xs text-brand-text-muted">
                      {getActivitySubtitle(a)} · {a.date}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPendingDelete(a)}
                    className="rounded-full p-2 text-destructive hover:bg-secondary"
                    aria-label={t('home.deleteActivity')}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={pendingDelete != null}
        title={t('home.deleteActivity')}
        description={t('common.areYouSure')}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        destructive
        loading={deleteActivity.isPending}
        onOpenChange={(v) => !v && setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
