import { routing, type Locale } from './routing';

export { routing, type Locale };

export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;

export const localeNames: Record<Locale, string> = {
  sr: 'Srpski',
  en: 'English',
};

export function isLocale(value: string): value is Locale {
  return (routing.locales as readonly string[]).includes(value);
}
