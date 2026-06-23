import type { Metadata, Viewport } from 'next';
import { Nunito } from 'next/font/google';

import { SITE_URL } from '@/constants';

import '@/styles/globals.css';

const nunito = Nunito({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-nunito',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: 'Bebiron',
  title: {
    default: 'Bebiron — Track every little moment',
    template: '%s · Bebiron',
  },
  description:
    'Bebiron je nežna PWA aplikacija za roditelje koja prati hranjenja, spavanje, pelene i čuva uspomene prvih 12 meseci.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Bebiron',
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/icons/icon-512.png',
  },
  openGraph: {
    type: 'website',
    title: 'Bebiron — Track every little moment',
    description:
      'Bebiron je nežna PWA aplikacija za roditelje koja prati hranjenja, spavanje, pelene i čuva uspomene prvih 12 meseci.',
    siteName: 'Bebiron',
    images: ['/icons/icon-512.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bebiron — Track every little moment',
    description:
      'Bebiron je nežna PWA aplikacija za roditelje koja prati hranjenja, spavanje, pelene i čuva uspomene prvih 12 meseci.',
    images: ['/icons/icon-512.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#FAF8F5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr" className={nunito.variable} suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-512.png" />
        <link rel="apple-touch-startup-image" href="/splash/splash-640x1136.png" media="(device-width: 320px) and (device-height: 568px)" />
        <link rel="apple-touch-startup-image" href="/splash/splash-750x1334.png" media="(device-width: 375px) and (device-height: 667px)" />
        <link rel="apple-touch-startup-image" href="/splash/splash-828x1792.png" media="(device-width: 414px) and (device-height: 896px)" />
        <link rel="apple-touch-startup-image" href="/splash/splash-1125x2436.png" media="(device-width: 375px) and (device-height: 812px)" />
        <link rel="apple-touch-startup-image" href="/splash/splash-1242x2688.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splash/splash-1536x2048.png" media="(device-width: 768px) and (device-height: 1024px)" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="overflow-x-clip font-sans">{children}</body>
    </html>
  );
}
