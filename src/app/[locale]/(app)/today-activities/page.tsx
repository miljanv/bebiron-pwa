import { setRequestLocale } from 'next-intl/server';

import { TodayActivitiesView } from '@/modules/children/components/today-activities-view';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function TodayActivitiesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TodayActivitiesView />;
}
