'use client';
import type { BookingWithRelations } from '@/services';
import { slideVariantKeys, Variants } from '@/shared/animations';
import { Button } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import type { Booking } from '@/shared/schemas';
import { AnimatePresence, motion, stagger } from 'framer-motion';
import { CircleCheck, LucideChevronRightSquare } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useOptimistic } from 'react';
import { CheckInOutButton } from './CheckInOutButton';
import { StatusBadge } from './StatusBadge';

type Action = Readonly<{
  type: 'delete';
  payload: {
    bookingId: Booking['id'];
  };
}>;

type State = readonly BookingWithRelations[];

export function TodayActivity({
  bookings,
}: {
  bookings: readonly BookingWithRelations[];
}) {
  const [optimisticBookings, updateOptimisticBookings] = useOptimistic<
    State,
    Action
  >(bookings, (currentState, action) => {
    switch (action.type) {
      case 'delete':
        return currentState.filter(
          booking => booking.id !== action.payload.bookingId
        );
      default:
        return currentState;
    }
  });

  return (
    <AnimatePresence mode='wait'>
      {optimisticBookings.length > 0 ? (
        <TodayActivityList
          bookings={optimisticBookings}
          onOptimisticUpdateAction={updateOptimisticBookings}
        />
      ) : (
        <EmptyTodayActivity />
      )}
    </AnimatePresence>
  );
}

export function TodayActivityList({
  bookings,
  onOptimisticUpdateAction,
}: {
  bookings: readonly BookingWithRelations[];
  onOptimisticUpdateAction: (action: Action) => void;
}) {
  return (
    <motion.ul
      variants={Variants.slideVariant(0, 30)}
      initial={slideVariantKeys.hidden}
      whileInView={slideVariantKeys.visible}
      viewport={{ amount: 0.5 }}
      exit={slideVariantKeys.safelyHidden}
      transition={{ type: 'spring', delayChildren: stagger(0.5) }}
      className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-y-8 lg:grid-cols-1'
    >
      {bookings.map(booking => (
        <TodayActivityItem
          key={booking.id}
          booking={booking}
          onOptimisticUpdateAction={onOptimisticUpdateAction}
        />
      ))}
    </motion.ul>
  );
}

export function TodayActivityItem({
  booking,
  onOptimisticUpdateAction,
}: {
  booking: BookingWithRelations;
  onOptimisticUpdateAction: (action: Action) => void;
}) {
  const isCheckIn = booking.status === 'unconfirmed';

  return (
    <motion.li
      variants={Variants.slideVariant(0, 30)}
      layout
      className='bg-muted border-border flex flex-col justify-between gap-4 rounded-lg px-4 py-4 shadow lg:flex-row lg:items-center lg:gap-4 lg:px-6'
    >
      <StatusBadge status={isCheckIn ? 'checked-in' : 'checked-out'} />

      <BasicInfo
        name={booking.guest.fullName}
        nationalFlagSrc={booking.guest.countryFlag}
        bookingId={booking.id}
      />

      <p className='text-muted-foreground ml-auto text-xs font-medium lg:ml-0 lg:text-base'>
        {booking.numNights} nights
      </p>

      <CheckInOutButton
        onClickedAction={() =>
          onOptimisticUpdateAction({
            type: 'delete',
            payload: { bookingId: booking.id },
          })
        }
        bookingId={booking.id}
        mode={isCheckIn ? 'checkin' : 'checkout'}
        className='w-full min-w-32 uppercase lg:w-fit'
      >
        <CircleCheck />
        {isCheckIn ? 'checkin' : 'checkout'}
      </CheckInOutButton>
    </motion.li>
  );
}

export function EmptyTodayActivity() {
  return (
    <motion.p
      key='fallback'
      variants={Variants.slideVariant(0, 30)}
      initial={slideVariantKeys.hidden}
      whileInView={slideVariantKeys.visible}
      exit={slideVariantKeys.safelyHidden}
      transition={{ type: 'spring' }}
      className='flex h-12 items-center justify-center'
    >
      There are no bookings due today.
    </motion.p>
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
