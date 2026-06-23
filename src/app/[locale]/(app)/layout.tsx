import { setRequestLocale } from 'next-intl/server';

import { AppShell } from '@/components/layout/app-shell';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AppLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Auth is enforced in src/middleware.ts — avoid Supabase calls here so
  // protected pages can be built on Vercel without env vars at build time.
  return <AppShell>{children}</AppShell>;
}
