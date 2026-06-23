'use client';

import { ArrowLeft } from 'lucide-react';

import { useRouter } from '@/lib/i18n/navigation';

export function AuthBackButton({ to }: { to?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      aria-label="Back"
      onClick={() => (to ? router.replace(to) : router.back())}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-brand transition hover:opacity-80"
    >
      <ArrowLeft className="h-5 w-5 text-brand-text" />
    </button>
  );
}
