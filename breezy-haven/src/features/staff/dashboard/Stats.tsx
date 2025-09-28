import {
  BanknotesIcon,
  BriefcaseIcon,
  CalendarDateRangeIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import type { ReactNode } from 'react';
import { StatCard } from './StatCard';

type Stat = Readonly<{
  label: string;
  icon: ReactNode;
  value: string;
  variant: Parameters<typeof StatCard>[number]['variant'];
}>;

type StatsProps = Readonly<{
  bookingCount: string;
  sales: string;
  checkinCount: string;
  occupancyRate: string;
}>;

export function Stats({
  bookingCount,
  sales,
  checkinCount,
  occupancyRate,
}: StatsProps) {
  STATS.set('booking', { ...STATS.get('booking')!, value: bookingCount });
  STATS.set('sale', { ...STATS.get('sale')!, value: sales });
  STATS.set('checkin', { ...STATS.get('checkin')!, value: checkinCount });
  STATS.set('occupancy', { ...STATS.get('occupancy')!, value: occupancyRate });

  return (
    <ul className='grid grid-cols-1 justify-items-center gap-8 md:grid-cols-2 md:gap-x-6 md:gap-y-8 lg:grid-cols-3 xl:grid-cols-4'>
      {Array.from(STATS).map(([key, stat]) => (
        <li key={key} className='w-full'>
          <StatCard
            key={key}
            variant={stat.variant}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
          />
        </li>
      ))}
    </ul>
  );
}

const STATS = new Map<'booking' | 'sale' | 'checkin' | 'occupancy', Stat>([
  [
    'booking',
    {
      label: 'Bookings',
      icon: <BriefcaseIcon className='h-5 w-5' />,
      value: '19',
      variant: 'blue',
    },
  ],
  [
    'sale',
    {
      label: 'Sales',
      icon: <BanknotesIcon className='h-5 w-5' />,
      value: '$67,085.00',
      variant: 'emerald',
    },
  ],
  [
    'checkin',
    {
      label: 'CheckIns',
      icon: <CalendarDateRangeIcon className='h-5 w-5' />,
      value: '20',
      variant: 'purple',
    },
  ],
  [
    'occupancy',
    {
      label: 'Occupancy Rates',
      icon: <ChartBarIcon className='h-5 w-5' />,
      value: '21',
      variant: 'yellow',
    },
  ],
]);
