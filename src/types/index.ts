export type BabyGender = 'male' | 'female';

export type Baby = {
  id: string;
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime?: string; // HH:mm
  gender?: BabyGender;
  avatarUri?: string;
  isOwner?: boolean;
};

export type ActivityType = 'feed' | 'sleep' | 'diaper';

export type FeedType = 'Formula' | 'Grudno mleko - Leva' | 'Grudno mleko - Desna';

export type DiaperType = 'wet' | 'dirty' | 'both';

export type FeedActivity = {
  id: string;
  babyId: string;
  type: 'feed';
  date: string;
  time: string;
  quantityMl: number;
  feedType: string;
};

export type SleepActivity = {
  id: string;
  babyId: string;
  type: 'sleep';
  date: string;
  startTime: string;
  endTime: string;
};

export type DiaperActivity = {
  id: string;
  babyId: string;
  type: 'diaper';
  date: string;
  time: string;
  diaperType: DiaperType;
};

export type Activity = FeedActivity | SleepActivity | DiaperActivity;

export type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export type NewActivity = DistributiveOmit<Activity, 'id'>;

export type GalleryEntry = {
  id: string;
  babyId: string;
  month: number;
  imageUrl: string;
};

export type UserNotificationSettings = {
  feedingReminderEnabled: boolean;
  feedingReminderMinutes: number;
};

export type ShareInvite = {
  code: string;
  expiresAt: string;
  babyId: string;
};

export type MusicTrack = {
  id: string;
  titleKey: string;
  emoji: string;
  src: string;
};

export type AccentPaletteItem = {
  id: 'sage' | 'blue' | 'cream';
  hex: string;
  name: string;
};

export type Locale = 'sr' | 'en';
