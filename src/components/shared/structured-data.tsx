import { SITE_URL } from '@/constants';

type Props = {
  locale: string;
};

export function StructuredData({ locale }: Props) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Bebiron',
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web',
    url: SITE_URL,
    inLanguage: locale === 'sr' ? 'sr-RS' : 'en-US',
    description:
      locale === 'sr'
        ? 'Bebiron je nežna aplikacija za roditelje koja prati hranjenja, spavanje, pelene i čuva uspomene prvih 12 meseci.'
        : 'Bebiron is a gentle app for parents to track feedings, sleep, diapers, and preserve memories from the first 12 months.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
