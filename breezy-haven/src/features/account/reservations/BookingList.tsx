'use client';

import {
  GetByGuestIdBookingSchema,
  ROUTES,
  slideVariantKeys,
  Variants,
} from '@/shared';
import { differenceInDays, parseISO } from 'date-fns';
import { AnimatePresence, motion, stagger } from 'framer-motion';
import Link from 'next/link';
import { useOptimistic } from 'react';
import type { $ZodIssue } from 'zod/v4/core';
import ReservationCard from './ReservationCard';

type Props = {
  bookings: {
    cabin: {
      name: string | null;
      image: string | null;
      maxCapacity: number | null;
    } | null;
    cabinId: number | null;
    cabinPrice: number | null;
    created_at: string;
    endDate: string | null;
    extrasPrice: number | null;
    guestId: number | null;
    hasBreakfast: boolean | null;
    id: number;
    isPaid: boolean | null;
    numGuests: number | null;
    numNights: number | null;
    observations: string | null;
    startDate: string | null;
    status: string | null;
    totalPrice: number | null;
  }[];
};

type OptimisticState = Props['bookings'];
type OptimisticAction = {
  type: 'delete';
  payload: { bookingId: number };
};

export default function BookingList({ bookings }: Props) {
  const [optimisticBookings, updateOptimisticBookings] = useOptimistic<
    OptimisticState,
    OptimisticAction
  >(
    bookings.slice().sort((a, b) => {
      const today = new Date();
      const dateA = a?.startDate ? parseISO(a.startDate) : today;
      const dateB = b?.startDate ? parseISO(b.startDate) : today;

      return (
        Math.abs(differenceInDays(dateA, today)) -
        Math.abs(differenceInDays(dateB, today))
      );
    }),

    (currentBookings, action) => {
      switch (action.type) {
        case 'delete':
          return currentBookings.filter(
            booking => booking.id !== action.payload.bookingId
          );
        default:
          return currentBookings;
      }
    }
  );

  if (optimisticBookings.length === 0)
    return (
      <p className='text-lg'>
        You have no reservations yet. Check out our{' '}
        <Link
          href={ROUTES.cabins.href}
          className='text-accent-500 animate-pulse underline'
        >
          luxury cabins &rarr;
        </Link>
      </p>
    );

  return (
    <AnimatePresence>
      <motion.ul
        variants={Variants.slideVariant(0, 30)}
        initial={slideVariantKeys.hidden}
        animate={slideVariantKeys.visible}
        exit={slideVariantKeys.safelyHidden}
        transition={{ delayChildren: stagger(0.5) }}
        className='space-y-6'
      >
        {optimisticBookings.map(booking => (
          <motion.li
            layout
            variants={Variants.slideVariant(0, 30)}
            key={booking.id}
          >
            <Booking
              booking={booking}
              onDelete={() =>
                updateOptimisticBookings({
                  type: 'delete',
                  payload: { bookingId: booking.id },
                })
              }
            />
          </motion.li>
        ))}
      </motion.ul>
    </AnimatePresence>
  );
}

function Booking({
  booking,
  onDelete,
}: {
  booking: Props['bookings'][number];
  onDelete: () => void;
}) {
  const result = GetByGuestIdBookingSchema.safeParse(booking);
  if (result.success) {
    return (
      <ReservationCard
        booking={result.data}
        cabin={result.data.cabin}
        onDelete={onDelete}
      />
    );
  }

  return <Fallback issues={result.error.issues} />;
}

function Fallback({ issues }: { issues: $ZodIssue[] }) {
  return (
    <article className='rounded bg-red-100 p-4 text-red-700'>
      <div className='font-bold'>Invalid booking data</div>
      <div className='mt-1 text-xs'>
        {issues.map((err, idx) => (
          <div key={idx}>
            <span className='font-mono'>{err.path.join('.')}</span>:{' '}
            {err.message}
          </div>
        ))}
      </div>
    </article>
  );
}
