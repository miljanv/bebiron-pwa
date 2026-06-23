'use client';

import { Baby as BabyIcon, Milk, Moon, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ACTIVITY_THEME } from '@/constants';
import { useActivities, useDeleteActivity } from '@/hooks/use-activities';
import { Link } from '@/lib/i18n/navigation';
import { cn } from '@/lib/utils/cn';
import { getActivitySubtitle, getLocalizedActivityTitle, getLocalizedSleepSummary } from '@/lib/utils/activity';
import { getLocalTodayString } from '@/lib/utils/datetime';
import type { Activity, ActivityType, SleepActivity } from '@/types';

import { FeedReminderCard } from '@/modules/feeding/components/feed-reminder-card';

function ActivityIcon({ type }: { type: ActivityType }) {
  const Icon = type === 'feed' ? Milk : type === 'sleep' ? Moon : BabyIcon;
  return <Icon className="h-5 w-5 text-white" />;
}

function SummaryCard({
  type,
  value,
  label,
  compact,
}: {
  type: ActivityType;
  value: string;
  label: string;
  compact?: boolean;
}) {
  const style = ACTIVITY_THEME[type];
  const Icon = type === 'feed' ? Milk : type === 'sleep' ? Moon : BabyIcon;
  return (
    <div className="flex flex-1 flex-col items-start gap-2 rounded-brand-md bg-card p-4 shadow-brand">
      <span
        className="flex h-10 w-10 items-center justify-center rounded-full"
        style={{ backgroundColor: style.bg }}
      >
        <Icon className="h-5 w-5" style={{ color: style.iconOnBg }} />
      </span>
      <p className={cn('font-bold text-brand-text', compact ? 'text-xl' : 'text-2xl')}>{value}</p>
      <p className="text-xs text-brand-text-muted">{label}</p>
    </div>
  );
}

function ActivityRow({
  activity,
  onDelete,
  isLast,
}: {
  activity: Activity;
  onDelete: (a: Activity) => void;
  isLast: boolean;
}) {
  const t = useTranslations();
  const style = ACTIVITY_THEME[activity.type];
  return (
    <div
      className={cn(
        'flex items-center gap-4 px-4 py-4',
        !isLast && 'border-b border-border',
      )}
    >
      <span
        className="flex h-11 w-11 items-center justify-center rounded-full"
        style={{ backgroundColor: style.bg }}
      >
        <ActivityIcon type={activity.type} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-brand-text">
          {getLocalizedActivityTitle(activity, t)}
        </p>
        <p className="truncate text-xs text-brand-text-muted">{getActivitySubtitle(activity)}</p>
      </div>
      <button
        type="button"
        onClick={() => onDelete(activity)}
        className="rounded-full p-2 text-destructive hover:bg-secondary"
        aria-label={t('home.deleteActivity')}
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
}

type Props = {
  selectedBabyId: string | null;
};

export function OverviewList({ selectedBabyId }: Props) {
  const t = useTranslations();
  const { data: activities = [], isLoading } = useActivities();
  const deleteActivity = useDeleteActivity();
  const [pendingDelete, setPendingDelete] = useState<Activity | null>(null);

  const today = getLocalTodayString();

  const filtered = useMemo(
    () => activities.filter((a) => a.babyId === selectedBabyId && a.date === today),
    [activities, selectedBabyId, today],
  );

  const feedCount = filtered.filter((a) => a.type === 'feed').length;
  const sleeps = filtered.filter((a) => a.type === 'sleep') as SleepActivity[];
  const sleepSummary = getLocalizedSleepSummary(sleeps, t);
  const diaperCount = filtered.filter((a) => a.type === 'diaper').length;
  const recent = filtered.slice(0, 5);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteActivity.mutateAsync(pendingDelete.id);
      setPendingDelete(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t('common.couldNotDelete'));
    }
  };

  if (!selectedBabyId) {
    return (
      <section className="px-5 pb-8 pt-6">
        <h2 className="mb-2 text-base font-bold text-brand-text">{t('home.todayOverview')}</h2>
        <p className="text-sm text-brand-text-muted">{t('home.selectBabyForActivities')}</p>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="px-5 pb-8 pt-6">
        <h2 className="mb-2 text-base font-bold text-brand-text">{t('home.todayOverview')}</h2>
        <div className="flex flex-col items-center gap-3 py-12">
          <LoadingSpinner size={32} />
          <p className="text-sm text-brand-text-muted">{t('home.loadingActivities')}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-5 pb-8 pt-6">
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-base font-bold text-brand-text">{t('home.todayOverview')}</h2>
        <Link href="/today-activities" className="text-sm font-semibold accent-text">
          {t('home.seeAll')}
        </Link>
      </div>

      <div className="flex gap-3">
        <SummaryCard type="feed" value={String(feedCount)} label={t('home.feedings')} />
        <SummaryCard type="sleep" value={sleepSummary} label={t('home.sleep')} compact />
        <SummaryCard type="diaper" value={String(diaperCount)} label={t('home.diapers')} />
      </div>

      {recent.length > 0 ? (
        <>
          <h3 className="mb-3 mt-6 px-1 text-base font-bold text-brand-text">
            {t('home.recentActivities')}
          </h3>
          <div className="overflow-hidden rounded-brand-lg bg-card shadow-brand">
            {recent.map((a, i) => (
              <ActivityRow
                key={a.id}
                activity={a}
                isLast={i === recent.length - 1}
                onDelete={setPendingDelete}
              />
            ))}
          </div>
        </>
      ) : null}

      <FeedReminderCard babyId={selectedBabyId} />

      {recent.length === 0 ? (
        <p className="mt-4 px-1 text-sm text-brand-text-muted">{t('home.noActivitiesToday')}</p>
      ) : null}

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
    </section>
  );
}
