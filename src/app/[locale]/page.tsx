import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LocaleIndex({ params }: Props) {
  const { locale } = await params;
  const prefix = locale === 'sr' ? '' : `/${locale}`;
  // Auth redirect is handled in middleware; fallback to welcome.
  redirect(`${prefix}/welcome`);
}
