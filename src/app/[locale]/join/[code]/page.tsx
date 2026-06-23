import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { JoinRedirectClient } from './client';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string; code: string }>;
};

export default async function JoinByCodePage({ params }: Props) {
  const { locale, code } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const prefix = locale === 'sr' ? '' : `/${locale}`;
    redirect(`${prefix}/login?join=${encodeURIComponent(code)}`);
  }

  return <JoinRedirectClient code={code} />;
}
