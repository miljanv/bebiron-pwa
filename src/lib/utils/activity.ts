import type { Activity, SleepActivity } from '@/types';

import { getSleepDurationMinutes } from './datetime';

type Translator = (key: string, params?: Record<string, string | number>) => string;

export function getActivitySubtitle(a: Activity): string {
  switch (a.type) {
    case 'feed':
      return `${a.time} · ${a.feedType}`;
    case 'sleep':
      return `${a.startTime} - ${a.endTime}`;
    case 'diaper':
      return a.time;
  }
}

export function getLocalizedActivityTitle(a: Activity, t: Translator): string {
  switch (a.type) {
    case 'feed':
      return t('home.activityTitleFeed', { ml: a.quantityMl });
    case 'sleep':
      return t('home.activityTitleSleep');
    case 'diaper':
      if (a.diaperType === 'wet') return t('home.activityTitleDiaperWet');
      if (a.diaperType === 'dirty') return t('home.activityTitleDiaperDirty');
      return t('home.activityTitleDiaper');
    default:
      return t('home.activityGeneric');
  }
}

export function getLocalizedSleepSummary(sleeps: SleepActivity[], t: Translator): string {
  const count = sleeps.length;
  if (count === 0) return t('home.sleepSummaryEmpty');
  const totalMinutes = sleeps.reduce(
    (sum, s) => sum + getSleepDurationMinutes(s.startTime, s.endTime),
    0,
  );
  const hours = Math.round(totalMinutes / 60);
  return t('home.sleepSummary', { hours, count });
}

export function getLocalizedAgeString(birthDate: string, t: Translator): string {
  const birth = new Date(birthDate);
  const now = new Date();
  let months =
    (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  if (now.getDate() - birth.getDate() < 0) months -= 1;

  const monthLabel =
    months === 1
      ? t('age.month1')
      : months >= 2 && months <= 4
        ? t('age.month2to4')
        : t('age.monthOther');

  if (months <= 12) {
    return t('age.monthsOnly', { months, monthLabel });
  }

  const years = Math.floor(months / 12);
  const remainderMonths = months % 12;
  const yearLabel =
    years === 1
      ? t('age.year1')
      : years >= 2 && years <= 4
        ? t('age.year2to4')
        : t('age.yearOther');

  if (remainderMonths === 0) {
    return t('age.yearsOnly', { years, yearLabel });
  }

  const remLabel =
    remainderMonths === 1
      ? t('age.month1')
      : remainderMonths >= 2 && remainderMonths <= 4
        ? t('age.month2to4')
        : t('age.monthOther');

  return t('age.yearsAndMonths', {
    years,
    yearLabel,
    months: remainderMonths,
    monthLabel: remLabel,
  });
}
