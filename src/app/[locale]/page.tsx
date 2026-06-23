import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LocaleIndex({ params }: Props) {
  const { locale } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const prefix = locale === 'sr' ? '' : `/${locale}`;
  redirect(user ? `${prefix}/home` : `${prefix}/welcome`);
}
