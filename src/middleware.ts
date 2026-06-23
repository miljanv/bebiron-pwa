import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';

import { routing } from '@/lib/i18n/routing';
import { updateSession } from '@/lib/supabase/middleware';

const intlMiddleware = createIntlMiddleware(routing);

const PUBLIC_PATHS = [
  '/welcome',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/join',
];

function stripLocale(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && (routing.locales as readonly string[]).includes(segments[0]!)) {
    return '/' + segments.slice(1).join('/');
  }
  return pathname;
}

function isPublicPath(pathname: string): boolean {
  const path = stripLocale(pathname);
  if (path === '/' || path === '') return false;
  return PUBLIC_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
}

function localizedPath(pathname: string, path: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const hasEnPrefix = segments[0] === 'en';
  return hasEnPrefix ? `/en${path}` : path;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/music') ||
    pathname.startsWith('/splash') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const { supabaseResponse, user } = await updateSession(request);
  const intlResponse = intlMiddleware(request);

  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value, cookie);
  });

  const path = stripLocale(pathname);

  if (!user && !isPublicPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = localizedPath(pathname, '/welcome');
    return NextResponse.redirect(url);
  }

  if (user && (path === '/welcome' || path === '/login' || path === '/register')) {
    const url = request.nextUrl.clone();
    url.pathname = localizedPath(pathname, '/home');
    return NextResponse.redirect(url);
  }

  return intlResponse;
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
