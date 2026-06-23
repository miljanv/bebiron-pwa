'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { useAccentStore } from '@/stores/use-accent-store';

import { Toaster } from '../ui/sonner';

function AccentColorBridge() {
  const accentColor = useAccentStore((s) => s.accentColor);
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', accentColor);
  }, [accentColor]);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [qc] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={qc}>
      <AccentColorBridge />
      {children}
      <Toaster />
    </QueryClientProvider>
  );
}
