import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-brand-warm-white px-6 text-center">
      <h1 className="text-2xl font-bold text-brand-text">404</h1>
      <p className="mt-2 text-brand-text-muted">Stranica nije pronađena.</p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-brand-lg bg-brand-sage px-6 py-3 text-sm font-semibold text-white"
      >
        Nazad na početnu
      </Link>
    </div>
  );
}
