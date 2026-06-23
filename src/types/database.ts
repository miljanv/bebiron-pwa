export type Json = string | number | boolean | null | { [k: string]: Json | undefined } | Json[];

type BabyRow = {
  id: string;
  user_id: string;
  name: string;
  birth_date: string;
  birth_time: string | null;
  gender: string | null;
  avatar_uri: string | null;
  created_at: string | null;
};

type BabyInsert = {
  id?: string;
  user_id: string;
  name: string;
  birth_date: string;
  birth_time?: string | null;
  gender?: string | null;
  avatar_uri?: string | null;
  created_at?: string | null;
};

type ActivityRow = {
  id: string;
  baby_id: string;
  type: 'feed' | 'sleep' | 'diaper';
  date: string;
  time: string | null;
  start_time: string | null;
  end_time: string | null;
  quantity_ml: number | null;
  feed_type: string | null;
  diaper_type: string | null;
  created_at: string | null;
};

type ActivityInsert = {
  id?: string;
  baby_id: string;
  type: 'feed' | 'sleep' | 'diaper';
  date: string;
  time?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  quantity_ml?: number | null;
  feed_type?: string | null;
  diaper_type?: string | null;
  created_at?: string | null;
};

type GalleryRow = {
  id: string;
  baby_id: string;
  month: number;
  image_url: string;
  created_at: string | null;
  updated_at: string | null;
};

type GalleryInsert = {
  id?: string;
  baby_id: string;
  month: number;
  image_url: string;
  created_at?: string | null;
  updated_at?: string | null;
};

type UserSettingsRow = {
  user_id: string;
  feeding_reminder_enabled: boolean;
  feeding_reminder_minutes: number;
  updated_at: string | null;
};

type UserSettingsInsert = {
  user_id: string;
  feeding_reminder_enabled?: boolean;
  feeding_reminder_minutes?: number;
  updated_at?: string | null;
};

type BabyCaregiverRow = {
  baby_id: string;
  user_id: string;
  role: 'owner' | 'caregiver';
  created_at: string | null;
};

type BabyCaregiverInsert = {
  baby_id: string;
  user_id: string;
  role: 'owner' | 'caregiver';
  created_at?: string | null;
};

type BabyShareInviteRow = {
  id: string;
  baby_id: string;
  code: string;
  created_by: string;
  expires_at: string;
  created_at: string | null;
};

type BabyShareInviteInsert = {
  id?: string;
  baby_id: string;
  code: string;
  created_by: string;
  expires_at: string;
  created_at?: string | null;
};

type PushSubscriptionRow = {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
};

type PushSubscriptionInsert = {
  id?: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  user_agent?: string | null;
  created_at?: string;
  updated_at?: string;
};

type FeedingReminderJobRow = {
  id: string;
  user_id: string;
  baby_id: string;
  baby_name: string;
  fire_at: string;
  sent_at: string | null;
  locale: string;
  created_at: string;
  updated_at: string;
};

type FeedingReminderJobInsert = {
  id?: string;
  user_id: string;
  baby_id: string;
  baby_name: string;
  fire_at: string;
  sent_at?: string | null;
  locale?: string;
  created_at?: string;
  updated_at?: string;
};

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '12';
  };
  public: {
    Tables: {
      babies: {
        Row: BabyRow;
        Insert: BabyInsert;
        Update: Partial<BabyInsert>;
        Relationships: [];
      };
      activities: {
        Row: ActivityRow;
        Insert: ActivityInsert;
        Update: Partial<ActivityInsert>;
        Relationships: [];
      };
      baby_gallery: {
        Row: GalleryRow;
        Insert: GalleryInsert;
        Update: Partial<GalleryInsert>;
        Relationships: [];
      };
      user_settings: {
        Row: UserSettingsRow;
        Insert: UserSettingsInsert;
        Update: Partial<UserSettingsInsert>;
        Relationships: [];
      };
      baby_caregivers: {
        Row: BabyCaregiverRow;
        Insert: BabyCaregiverInsert;
        Update: Partial<BabyCaregiverInsert>;
        Relationships: [];
      };
      baby_share_invites: {
        Row: BabyShareInviteRow;
        Insert: BabyShareInviteInsert;
        Update: Partial<BabyShareInviteInsert>;
        Relationships: [];
      };
      push_subscriptions: {
        Row: PushSubscriptionRow;
        Insert: PushSubscriptionInsert;
        Update: Partial<PushSubscriptionInsert>;
        Relationships: [];
      };
      feeding_reminder_jobs: {
        Row: FeedingReminderJobRow;
        Insert: FeedingReminderJobInsert;
        Update: Partial<FeedingReminderJobInsert>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      count_owned_babies: {
        Args: Record<string, never>;
        Returns: number;
      };
      accept_baby_share_code: {
        Args: { p_code: string };
        Returns: string;
      };
      upsert_baby_gallery: {
        Args: { p_baby_id: string; p_month: number; p_image_url: string };
        Returns: void;
      };
      delete_my_account: {
        Args: Record<string, never>;
        Returns: void;
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
