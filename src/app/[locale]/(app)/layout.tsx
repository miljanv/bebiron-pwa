import { setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';

import { AppShell } from '@/components/layout/app-shell';
import { createClient } from '@/lib/supabase/server';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AppLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    const prefix = locale === 'sr' ? '' : `/${locale}`;
    redirect(`${prefix}/welcome`);
  }

  return <AppShell>{children}</AppShell>;
}
