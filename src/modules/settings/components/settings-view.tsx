'use client';

import {
  Bell,
  BookOpen,
  Check,
  ChevronRight,
  Download,
  LogOut,
  Palette,
  Trash2,
  User as UserIcon,
  Users,
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Switch } from '@/components/ui/switch';
import {
  ACCENT_PALETTE,
  APP_VERSION,
  BRAND_COLORS,
  MAX_OWNED_BABIES,
} from '@/constants';
import { useAuth } from '@/hooks/use-auth';
import { useBabies } from '@/hooks/use-babies';
import {
  useNotificationSettings,
  useSaveNotificationSettings,
} from '@/hooks/use-notification-settings';
import { usePwaInstall } from '@/hooks/use-pwa-install';
import { useRouter } from '@/lib/i18n/navigation';
import {
  isPushSupported,
  subscribeToPushNotifications,
  syncFeedingReminders,
  unsubscribeFromPushNotifications,
} from '@/lib/push/client';
import { cn } from '@/lib/utils/cn';
import { authService, userService } from '@/services/supabase';
import { useAccentStore } from '@/stores/use-accent-store';

import { JoinBabyDialog } from './join-baby-dialog';

const ACCENT_NAME_KEYS: Record<
  string,
  'settings.colorSage' | 'settings.colorBlue' | 'settings.colorCream'
> = {
  sage: 'settings.colorSage',
  blue: 'settings.colorBlue',
  cream: 'settings.colorCream',
};

function SettingsCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('overflow-hidden rounded-brand-lg bg-card shadow-brand', className)}>
      {children}
    </div>
  );
}

function SettingsRow({
  icon,
  iconBg,
  title,
  subtitle,
  right,
  onClick,
  isLast,
  titleColor,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onClick?: () => void;
  isLast?: boolean;
  titleColor?: string;
}) {
  const inner = (
    <div
      className={cn(
        'flex min-w-0 items-center gap-3 p-4 sm:gap-4',
        !isLast && 'border-b border-border',
      )}
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: iconBg }}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={cn('break-words text-sm font-semibold leading-snug')}
          style={titleColor ? { color: titleColor } : undefined}
        >
          {title}
        </p>
        {subtitle ? (
          <p className="mt-0.5 break-words text-xs leading-snug text-brand-text-muted">
            {subtitle}
          </p>
        ) : null}
      </div>
      <div className="shrink-0">{right ?? <ChevronRight className="h-5 w-5 text-brand-text-muted" />}</div>
    </div>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="block w-full max-w-full text-left">
        {inner}
      </button>
    );
  }
  return inner;
}

export function SettingsView() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { user } = useAuth();
  const { data: babies = [] } = useBabies();
  const { data: settings, isLoading: loadingSettings } = useNotificationSettings();
  const saveSettings = useSaveNotificationSettings();

  const accentColor = useAccentStore((s) => s.accentColor);
  const setAccentColor = useAccentStore((s) => s.setAccentColor);

  const { canInstall, promptInstall } = usePwaInstall();

  const [joinBabyOpen, setJoinBabyOpen] = useState(false);
  const [delayMinutes, setDelayMinutes] = useState('180');
  const [deletePending, setDeletePending] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (settings) setDelayMinutes(String(settings.feedingReminderMinutes));
  }, [settings]);

  const ownedCount = babies.filter((b) => b.isOwner === true).length;

  const handleToggleReminder = async (value: boolean) => {
    try {
      if (value) {
        if (!isPushSupported()) {
          toast.error(t('settings.notificationsUnsupported'));
          return;
        }
        const subscribed = await subscribeToPushNotifications();
        if (!subscribed) {
          toast.error(t('settings.notificationPermissionMessage'));
          return;
        }
      } else {
        await unsubscribeFromPushNotifications().catch(() => undefined);
      }

      await saveSettings.mutateAsync({ feedingReminderEnabled: value });
      await syncFeedingReminders(locale);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t('settings.saveFailed'));
    }
  };

  const handleConfirmMinutes = async () => {
    const n = parseInt(delayMinutes.trim(), 10);
    if (!Number.isFinite(n) || n < 1 || n > 1440) {
      toast.error(t('settings.minutesRange'));
      return;
    }
    const clamped = Math.max(1, Math.min(1440, n));
    try {
      await saveSettings.mutateAsync({ feedingReminderMinutes: clamped });
      setDelayMinutes(String(clamped));
      await syncFeedingReminders(locale);
      toast.success(t('settings.reminderSaved', { minutes: clamped }));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t('settings.saveFailed'));
    }
  };

  const handleSignOut = async () => {
    await authService.signOut();
    router.replace('/welcome');
    router.refresh();
  };

  const handleDeleteAccount = async () => {
    setDeletePending(true);
    try {
      await userService.deleteAccount();
      await authService.signOut();
      toast.success(t('settings.accountDeletedMessage'));
      router.replace('/welcome');
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t('settings.couldNotDeleteAccount'));
    } finally {
      setDeletePending(false);
      setConfirmDelete(false);
    }
  };

  const feedReminderOn = settings?.feedingReminderEnabled ?? false;

  return (
    <div className="mx-auto box-border w-full max-w-3xl overflow-x-hidden px-4 pb-12 pt-safe sm:px-5 lg:pt-8">
      <h1 className="break-words pt-4 text-2xl font-bold text-brand-text xs:text-3xl">
        {t('settings.title')}
      </h1>

      {user?.email ? (
        <SettingsCard className="mt-6">
          <div className="flex min-w-0 items-center gap-3 p-4 sm:gap-4 sm:p-5">
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full sm:h-16 sm:w-16"
              style={{ backgroundColor: BRAND_COLORS.sage }}
            >
              <UserIcon className="h-6 w-6 text-white sm:h-7 sm:w-7" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="break-all text-base font-bold uppercase text-brand-text sm:text-lg">
                {user.email.split('@')[0]}
              </p>
              <p className="break-all text-sm text-brand-text-muted">{user.email}</p>
            </div>
          </div>
        </SettingsCard>
      ) : null}

      <SectionLabel>{t('help.section')}</SectionLabel>
      <SettingsCard className="mt-3">
        <SettingsRow
          icon={<BookOpen className="h-5 w-5" style={{ color: BRAND_COLORS.sage }} />}
          iconBg="rgba(139, 155, 142, 0.15)"
          title={t('help.menuTitle')}
          subtitle={t('help.menuSubtitle')}
          onClick={() => router.push('/help')}
          isLast
        />
      </SettingsCard>

      <SectionLabel>{t('settings.sectionSettings')}</SectionLabel>
      <SettingsCard className="mt-3">
        <SettingsRow
          icon={<Bell className="h-5 w-5" style={{ color: BRAND_COLORS.softBlue }} />}
          iconBg="rgba(164, 196, 212, 0.2)"
          title={t('settings.notifications')}
          subtitle={t('settings.feedingReminder')}
          right={
            !loadingSettings ? (
              <Switch
                checked={feedReminderOn}
                onCheckedChange={handleToggleReminder}
                disabled={saveSettings.isPending}
              />
            ) : (
              <LoadingSpinner size={16} />
            )
          }
          isLast={!feedReminderOn}
        />
        {feedReminderOn ? (
          <div className="border-t border-border px-3 pb-4 sm:px-4">
            <p className="mt-3 break-words text-xs leading-relaxed text-brand-text-muted">
              {t('settings.pushReminderHint')}
            </p>
            <p className="mt-2 break-words text-xs leading-relaxed text-brand-text-muted">
              {t('settings.reminderDesc')}
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <label className="min-w-0 text-sm font-semibold leading-snug text-brand-text sm:flex-1">
                {t('settings.minutesAfterFeed')}
              </label>
              <Input
                type="number"
                inputMode="numeric"
                maxLength={4}
                value={delayMinutes}
                onChange={(e) => setDelayMinutes(e.target.value)}
                className="w-full shrink-0 sm:w-20 sm:text-center"
              />
            </div>
            <Button
              type="button"
              size="sm"
              className="mt-3 w-full"
              loading={saveSettings.isPending}
              onClick={handleConfirmMinutes}
            >
              {t('common.confirm')}
            </Button>
          </div>
        ) : null}
      </SettingsCard>

      <SectionLabel>{t('settings.sectionFamily')}</SectionLabel>
      <SettingsCard className="mt-3">
        <SettingsRow
          icon={<Users className="h-5 w-5" style={{ color: BRAND_COLORS.sage }} />}
          iconBg="rgba(139, 155, 142, 0.15)"
          title={t('settings.joinBaby')}
          subtitle={t('settings.joinBabySubtitle')}
          onClick={() => setJoinBabyOpen(true)}
          isLast
        />
        <p className="break-words px-3 pb-4 text-xs leading-relaxed text-brand-text-muted sm:px-4">
          {t('settings.familyHint', { max: MAX_OWNED_BABIES, count: ownedCount })}
        </p>
      </SettingsCard>

      <SectionLabel>{t('settings.sectionAppearance')}</SectionLabel>
      <SettingsCard className="mt-3">
        <div className="overflow-hidden p-3 sm:p-4">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: BRAND_COLORS.mint }}
            >
              <Palette className="h-5 w-5" style={{ color: BRAND_COLORS.sage }} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="break-words text-sm font-semibold text-brand-text">
                {t('settings.primaryColor')}
              </p>
              <p className="mt-0.5 break-words text-xs leading-snug text-brand-text-muted">
                {t('settings.primaryColorSubtitle')}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
            {ACCENT_PALETTE.map((item) => {
              const selected = accentColor.toLowerCase() === item.hex.toLowerCase();
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAccentColor(item.hex)}
                  className="flex min-w-0 flex-col items-center gap-2 px-0.5"
                >
                  <span
                    className={cn(
                      'flex aspect-square w-full max-w-14 items-center justify-center rounded-full border-4 border-transparent',
                      selected && 'border-white shadow-brand',
                    )}
                    style={{ backgroundColor: item.hex }}
                  >
                    {selected ? (
                      <Check className="h-5 w-5 text-white" strokeWidth={3} />
                    ) : null}
                  </span>
                  <span className="w-full break-words text-center text-xs leading-tight text-brand-text-muted">
                    {t(ACCENT_NAME_KEYS[item.id] ?? `settings.color${item.id}`)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </SettingsCard>

      <SectionLabel>{t('language.label')}</SectionLabel>
      <SettingsCard className="mt-3">
        <div className="overflow-hidden p-3 sm:p-4">
          <LanguageSwitcher variant="settings" />
        </div>
      </SettingsCard>

      {canInstall ? (
        <SettingsCard className="mt-4">
          <SettingsRow
            icon={<Download className="h-5 w-5" style={{ color: BRAND_COLORS.sage }} />}
            iconBg="rgba(139, 155, 142, 0.15)"
            title={t('settings.installApp')}
            subtitle={t('settings.installAppHint')}
            onClick={promptInstall}
            isLast
          />
        </SettingsCard>
      ) : null}

      <SectionLabel>{t('settings.sectionAccount')}</SectionLabel>
      <SettingsCard className="mt-3">
        <SettingsRow
          icon={<LogOut className="h-5 w-5 text-destructive" />}
          iconBg="rgba(217, 123, 123, 0.1)"
          title={t('settings.signOut')}
          titleColor="hsl(var(--destructive))"
          onClick={handleSignOut}
        />
        <SettingsRow
          icon={
            deletePending ? (
              <LoadingSpinner size={16} className="text-destructive" />
            ) : (
              <Trash2 className="h-5 w-5 text-destructive" />
            )
          }
          iconBg="rgba(217, 123, 123, 0.1)"
          title={deletePending ? t('common.deleting') : t('settings.deleteAccount')}
          subtitle={t('settings.deleteAccountSubtitle')}
          titleColor="hsl(var(--destructive))"
          onClick={deletePending ? undefined : () => setConfirmDelete(true)}
          isLast
        />
      </SettingsCard>

      <p className="mt-4 text-center text-xs text-brand-text-muted">
        {t('settings.version', { version: APP_VERSION })}
      </p>

      <JoinBabyDialog open={joinBabyOpen} onClose={() => setJoinBabyOpen(false)} />

      <ConfirmDialog
        open={confirmDelete}
        title={t('settings.deleteAccountTitle')}
        description={t('settings.deleteAccountMessage')}
        confirmLabel={t('settings.deleteAccount')}
        cancelLabel={t('common.cancel')}
        destructive
        loading={deletePending}
        onOpenChange={(v) => !v && setConfirmDelete(false)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="ml-0.5 mt-6 break-words text-xs font-semibold uppercase tracking-wide text-brand-text-muted sm:ml-1 sm:tracking-wider">
      {children}
    </p>
  );
}
