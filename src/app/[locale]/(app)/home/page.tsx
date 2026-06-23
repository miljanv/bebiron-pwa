import { setRequestLocale } from 'next-intl/server';

import { HomeView } from '@/modules/home/components/home-view';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HomeView />;
}
