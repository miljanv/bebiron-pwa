import { DEFAULT_FEEDING_REMINDER_MINUTES } from '@/constants';
import { createClient } from '@/lib/supabase/client';
import type { UserNotificationSettings } from '@/types';

const DEFAULTS: UserNotificationSettings = {
  feedingReminderEnabled: false,
  feedingReminderMinutes: DEFAULT_FEEDING_REMINDER_MINUTES,
};

const MIN_MINUTES = 1;
const MAX_MINUTES = 1440;

function clampMinutes(minutes: number): number {
  return Math.round(Math.max(MIN_MINUTES, Math.min(MAX_MINUTES, minutes)));
}

function isMissingError(err: { code?: string; message?: string }): boolean {
  return (
    err.code === '42P01' ||
    err.code === 'PGRST205' ||
    (err.message?.includes('user_settings') ?? false)
  );
}

export const userService = {
  async getNotificationSettings(userId: string): Promise<UserNotificationSettings> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('user_settings')
      .select('feeding_reminder_enabled, feeding_reminder_minutes')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) {
      if (isMissingError(error)) return { ...DEFAULTS };
      throw error;
    }
    if (!data) return { ...DEFAULTS };
    return {
      feedingReminderEnabled: data.feeding_reminder_enabled,
      feedingReminderMinutes: clampMinutes(data.feeding_reminder_minutes),
    };
  },

  async saveNotificationSettings(
    userId: string,
    partial: Partial<UserNotificationSettings>,
  ): Promise<UserNotificationSettings> {
    const current = await userService.getNotificationSettings(userId);
    const next: UserNotificationSettings = {
      feedingReminderEnabled:
        partial.feedingReminderEnabled ?? current.feedingReminderEnabled,
      feedingReminderMinutes:
        partial.feedingReminderMinutes != null
          ? clampMinutes(partial.feedingReminderMinutes)
          : current.feedingReminderMinutes,
    };
    const supabase = createClient();
    const { error } = await supabase.from('user_settings').upsert(
      {
        user_id: userId,
        feeding_reminder_enabled: next.feedingReminderEnabled,
        feeding_reminder_minutes: next.feedingReminderMinutes,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    );
    if (error) {
      if (isMissingError(error)) {
        throw new Error(
          'user_settings table is missing. Run migration 007 in Supabase SQL Editor.',
        );
      }
      throw error;
    }
    return next;
  },

  async deleteAccount(): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.rpc('delete_my_account');
    if (error) {
      const msg = error.message ?? 'Could not delete account.';
      if (error.code === 'PGRST202' || msg.includes('delete_my_account')) {
        throw new Error(
          'Account deletion is not enabled in the database. Run migrations 010 and 011.',
        );
      }
      throw new Error(msg);
    }
  },
};
