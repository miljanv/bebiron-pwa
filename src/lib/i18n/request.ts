import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

import { defaultLocale, isLocale } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = requested && isLocale(requested) ? requested : defaultLocale;
  if (!isLocale(locale)) notFound();

  const messages = (await import(`@/translations/${locale}.json`)).default;

  return {
    locale,
    messages,
    timeZone: 'Europe/Belgrade',
    now: new Date(),
  };
});
