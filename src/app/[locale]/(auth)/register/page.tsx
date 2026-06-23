import { setRequestLocale } from 'next-intl/server';

import { AuthTopBar } from '@/modules/auth/components/auth-top-bar';
import { RegisterForm } from '@/modules/auth/components/register-form';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function RegisterPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="pb-12">
      <AuthTopBar backTo="/welcome" />
      <div className="mt-6">
        <RegisterForm />
      </div>
    </div>
  );
}
