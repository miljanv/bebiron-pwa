import type { AccentPaletteItem, MusicTrack } from '@/types';

export const MAX_OWNED_BABIES = 3;

export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? '1.0.2';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const DEFAULT_FEEDING_REMINDER_MINUTES = 180;

export const ACCENT_PALETTE: readonly AccentPaletteItem[] = [
  { id: 'sage', hex: '#8B9B8E', name: 'Sage' },
  { id: 'blue', hex: '#A4C4D4', name: 'Plava' },
  { id: 'cream', hex: '#C4B5A0', name: 'Krem' },
] as const;

export const DEFAULT_ACCENT = '#8B9B8E';

export const ACCENT_STORAGE_KEY = 'bebiron_accent';
export const LOCALE_STORAGE_KEY = 'bebiron_locale';
export const REMINDER_DISMISS_KEY_PREFIX = 'bebiron_reminder_dismiss_';

export const BRAND_COLORS = {
  sage: '#8B9B8E',
  softBlue: '#A4C4D4',
  cream: '#C4B5A0',
  creamBg: '#E8DED0',
  beige: '#F5F1EC',
  warmWhite: '#FAF8F5',
  mint: '#D4E4D7',
  destructive: '#D97B7B',
  text: '#3A3A3A',
  textMuted: '#9A8F82',
} as const;

export const ACTIVITY_THEME = {
  feed: {
    bg: '#D4E4D7',
    icon: '#8B9B8E',
    iconOnBg: '#8B9B8E',
  },
  sleep: {
    bg: '#E8DED0',
    icon: '#C4B5A0',
    iconOnBg: '#C4B5A0',
  },
  diaper: {
    bg: 'rgba(164, 196, 212, 0.2)',
    icon: '#A4C4D4',
    iconOnBg: '#A4C4D4',
  },
} as const;

export const FEED_TYPE_OPTIONS = [
  { value: 'Formula', labelKey: 'home.feedTypeFormula' },
  { value: 'Grudno mleko - Leva', labelKey: 'home.feedTypeBreastLeft' },
  { value: 'Grudno mleko - Desna', labelKey: 'home.feedTypeBreastRight' },
] as const;

export const MUSIC_TRACKS: readonly MusicTrack[] = [
  {
    id: 'white-noise',
    titleKey: 'memories.trackWhiteNoise',
    emoji: '🌊',
    src: '/music/white-noise.mp3',
  },
  {
    id: 'rain',
    titleKey: 'memories.trackRain',
    emoji: '🌧️',
    src: '/music/rain.mp3',
  },
  {
    id: 'sleep-music',
    titleKey: 'memories.trackSleepMusic',
    emoji: '🌙',
    src: '/music/sleep-music.mp3',
  },
] as const;

export const LOCALES = ['sr', 'en'] as const;
export const DEFAULT_LOCALE = 'sr';
