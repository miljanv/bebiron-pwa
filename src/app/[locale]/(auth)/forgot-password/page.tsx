import { setRequestLocale } from 'next-intl/server';

import { AuthTopBar } from '@/modules/auth/components/auth-top-bar';
import { ForgotPasswordForm } from '@/modules/auth/components/forgot-password-form';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ForgotPasswordPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="pb-12">
      <AuthTopBar backTo="/login" />
      <div className="mt-6">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
