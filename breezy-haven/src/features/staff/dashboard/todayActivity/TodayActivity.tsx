import type { BookingWithRelations } from '@/services';
import { Button } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { CircleCheck, LucideChevronRightSquare } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { StatusBadge } from './StatusBadge';

export function TodayActivity({
  bookings,
}: {
  bookings: readonly BookingWithRelations[];
}) {
  return (
    <ul className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-y-8 lg:grid-cols-1'>
      {bookings.map(booking => (
        <li
          key={booking.id}
          className='bg-muted border-border flex flex-col justify-between gap-4 rounded-lg px-2 py-4 shadow lg:flex-row lg:items-center lg:gap-4 lg:px-6'
        >
          <StatusBadge
            status={
              booking.status === 'unconfirmed' ? 'checked-in' : 'checked-out'
            }
          />
          <BasicInfo
            name={booking.guest.fullName}
            nationalFlagSrc={booking.guest.countryFlag}
            bookingId={booking.id}
          />
          <p className='text-muted-foreground ml-auto text-xs font-medium lg:ml-0 lg:text-base'>
            {booking.numNights} nights
          </p>
          <OperationButton className='w-full min-w-32 uppercase lg:w-fit'>
            <CircleCheck />{' '}
            {booking.status === 'unconfirmed' ? 'checkin' : 'checkout'}
          </OperationButton>
        </li>
      ))}
    </ul>
  );
}

function BasicInfo({
  name,
  nationalFlagSrc,
  bookingId,
}: {
  name: string;
  nationalFlagSrc: string;
  bookingId: number;
}) {
  return (
    <div className='flex max-w-80 items-center gap-2'>
      <div className='relative aspect-video h-8 overflow-hidden rounded shadow shadow-indigo-500'>
        <Image
          alt='country flag'
          src={nationalFlagSrc}
          fill
          className='object-cover object-center'
        />
      </div>

      <p className='text-pretty'>{name}</p>

      <Button variant='link' className='text-muted-foreground' asChild>
        <Link href={`${ROUTES.staff.nested.bookings.href}/${bookingId}`}>
          <LucideChevronRightSquare />
          Details
        </Link>
      </Button>
    </div>
  );
}

function OperationButton({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  return (
    <Button variant='gradient' className={className}>
      {children}
    </Button>
  );
}
