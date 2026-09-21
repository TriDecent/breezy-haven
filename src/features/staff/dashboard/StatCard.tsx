import { cn } from '@/lib';
import { Card, CardContent } from '@/shared/components';
import type { ReactNode } from 'react';

type StatProps = Readonly<{
  variant: keyof typeof VARIANTS;
  icon: ReactNode;
  label: string;
  value: string;
  className?: string;
}>;

export function StatCard({
  variant,
  icon,
  label,
  value,
  className,
}: StatProps) {
  const selectedVariant = VARIANTS[variant];

  return (
    <Card
      className={cn(`flex flex-row items-center gap-4 px-4 py-3`, className)}
    >
      <div
        className={`border-border rounded-full border shadow-xs shadow-black ${selectedVariant.color} p-4`}
      >
        {icon}
      </div>
      <CardContent className='p-0'>
        <p className='flex flex-col gap-2'>
          <span className='text-muted-foreground text-sm tracking-wider uppercase'>
            {label}
          </span>
          <span className='text-xl font-medium tracking-wide'>{value}</span>
        </p>
      </CardContent>
    </Card>
  );
}

const VARIANTS = {
  emerald: {
    color: 'bg-emerald-100 text-emerald-800',
  },
  blue: {
    color: 'bg-blue-100 text-blue-800',
  },
  purple: {
    color: 'bg-purple-100 text-purple-800',
  },
  yellow: {
    color: 'bg-yellow-100 text-yellow-800',
  },
} as const;
