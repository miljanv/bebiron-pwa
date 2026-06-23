import { User } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

type Props = {
  size?: number;
  email?: string | null;
  className?: string;
};

export function UserAvatar({ size = 64, email, className }: Props) {
  const initials = email ? email.split('@')[0]!.slice(0, 2).toUpperCase() : '';
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-brand-sage text-white',
        className,
      )}
      style={{ width: size, height: size }}
    >
      {initials ? (
        <span className="text-base font-bold">{initials}</span>
      ) : (
        <User className="h-1/2 w-1/2" />
      )}
    </div>
  );
}
