import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

type Props = {
  size?: number;
  className?: string;
};

export function LoadingSpinner({ size = 28, className }: Props) {
  return (
    <Loader2
      className={cn('animate-spin accent-text', className)}
      style={{ width: size, height: size }}
      aria-label="Loading"
    />
  );
}
