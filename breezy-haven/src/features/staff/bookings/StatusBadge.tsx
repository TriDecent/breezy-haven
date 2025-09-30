import type { Booking } from '@/shared/schemas';
import { cn } from '@/shared/utils';

const StatusStyle: Record<Booking['status'], string> = {
  unconfirmed: 'bg-sky-200 text-sky-700',
  'checked-in': 'bg-green-200 text-emerald-700',
  'checked-out': 'bg-slate-300 text-slate-700',
} as const;

export function StatusBadge({
  status,
  className,
}: {
  status: keyof typeof StatusStyle;
  className?: string;
}) {
  return (
    <span
      className={cn(
        `${StatusStyle[status]} rounded-full px-4 py-2 font-semibold tracking-tighter uppercase`,
        className
      )}
    >
      {status}
    </span>
  );
}
