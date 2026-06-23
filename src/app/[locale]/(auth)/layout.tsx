import { setRequestLocale } from 'next-intl/server';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AuthLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="min-h-dvh welcome-bg">
      <div className="mx-auto w-full max-w-md px-6 pt-safe">{children}</div>
    </div>
  );
}
