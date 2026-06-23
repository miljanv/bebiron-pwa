import { setRequestLocale } from 'next-intl/server';

import { AuthTopBar } from '@/modules/auth/components/auth-top-bar';
import { ResetPasswordForm } from '@/modules/auth/components/reset-password-form';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ResetPasswordPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="pb-12">
      <AuthTopBar backTo="/login" />
      <div className="mt-6">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
