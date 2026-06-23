'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="sr">
      <body className="bg-brand-warm-white font-sans text-brand-text">
        <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
          <h1 className="text-2xl font-bold">Došlo je do greške</h1>
          <p className="mt-2 text-brand-text-muted">Pokušajte ponovo ili se vratite na početnu stranicu.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => reset()}
              className="rounded-brand-lg bg-brand-sage px-6 py-3 text-sm font-semibold text-white"
            >
              Pokušaj ponovo
            </button>
            <Link
              href="/"
              className="rounded-brand-lg border border-brand-beige bg-card px-6 py-3 text-sm font-semibold text-brand-text"
            >
              Početna
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
