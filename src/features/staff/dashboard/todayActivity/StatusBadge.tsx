import type { Booking } from '@/shared/schemas';
import { cn } from '@/shared/utils';
import type { ClassValue } from 'clsx';

const StatusStyle: Record<
  Exclude<Booking['status'], 'unconfirmed'>,
  { name: string; style: ClassValue }
> = {
  'checked-in': { name: 'Arriving', style: 'bg-emerald-100 text-emerald-800' },
  'checked-out': { name: 'Departing', style: 'bg-blue-100 text-blue-800' },
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
        `${StatusStyle[status].style} border-border w-fit min-w-21 rounded-full border-1 px-2 py-1 text-center text-xs font-semibold tracking-tighter uppercase shadow-xl`,
        className
      )}
    >
      {StatusStyle[status].name}
    </span>
  );
}
