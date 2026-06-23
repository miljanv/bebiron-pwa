import { setRequestLocale } from 'next-intl/server';

import { LoginForm } from '@/modules/auth/components/login-form';
import { AuthTopBar } from '@/modules/auth/components/auth-top-bar';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="pb-12">
      <AuthTopBar backTo="/welcome" />
      <div className="mt-6">
        <LoginForm />
      </div>
    </div>
  );
}
