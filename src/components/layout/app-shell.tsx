'use client';

import { DesktopSidebar } from './desktop-sidebar';
import { MobileBottomNavigation } from './mobile-bottom-navigation';

type Props = {
  children: React.ReactNode;
  hideNav?: boolean;
};

export function AppShell({ children, hideNav }: Props) {
  return (
    <div className="flex min-h-dvh bg-background">
      <DesktopSidebar hidden={hideNav} />
      <main className="flex-1 pb-24 lg:pb-0">{children}</main>
      <MobileBottomNavigation hidden={hideNav} />
    </div>
  );
}
