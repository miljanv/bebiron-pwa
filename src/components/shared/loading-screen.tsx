import { LoadingSpinner } from '@/components/ui/loading-spinner';

type Props = {
  label?: string;
};

export function LoadingScreen({ label }: Props) {
  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-3">
      <LoadingSpinner size={36} />
      {label ? <p className="text-sm text-brand-text-muted">{label}</p> : null}
    </div>
  );
}
