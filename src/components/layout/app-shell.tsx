'use client';

import { DesktopSidebar } from './desktop-sidebar';
import { MobileBottomNavigation } from './mobile-bottom-navigation';

type Props = {
  children: React.ReactNode;
  hideNav?: boolean;
};

export function AppShell({ children, hideNav }: Props) {
  return (
    <div className="flex min-h-dvh w-full max-w-[100vw] overflow-x-hidden bg-background">
      <DesktopSidebar hidden={hideNav} />
      <main className="min-w-0 flex-1 overflow-x-hidden pb-24 lg:pb-0">{children}</main>
      <MobileBottomNavigation hidden={hideNav} />
    </div>
  );
}
