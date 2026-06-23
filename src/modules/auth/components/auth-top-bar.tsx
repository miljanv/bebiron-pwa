import { AuthBackButton } from '@/components/shared/auth-back-button';
import { LanguageSwitcher } from '@/components/shared/language-switcher';

export function AuthTopBar({ backTo }: { backTo?: string }) {
  return (
    <div className="flex items-center justify-between pt-2">
      <AuthBackButton to={backTo} />
      <LanguageSwitcher variant="auth-compact" />
    </div>
  );
}
