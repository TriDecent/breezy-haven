'use client';

import Variants from '@/shared/animations/Variants';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { PriorityProvider } from '@/shared/providers';
import { GetByGuestIdBookingSchema } from '@/shared/schemas';
import { differenceInDays, isPast, isToday, parseISO } from 'date-fns';
import { AnimatePresence, motion, stagger } from 'framer-motion';
import { Bird } from 'lucide-react';
import Link from 'next/link';
import { useOptimistic } from 'react';
import type { $ZodIssue } from 'zod/v4/core';
import ReservationCard from './ReservationCard';

type Props = {
  bookings: {
    cabin: {
      name: string;
      image: string;
      maxCapacity: number;
    };
    cabinId: number;
    cabinPrice: number;
    created_at: string;
    endDate: string;
    extrasPrice: number;
    guestId: number;
    hasBreakfast: boolean;
    id: number;
    isPaid: boolean;
    numGuests: number;
    numNights: number;
    observations: string;
    startDate: string;
    status: string;
    totalPrice: number;
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
      const dateA = parseISO(a.startDate);
      const dateB = parseISO(b.startDate);

      const aIsPast = isPast(dateA) && !isToday(dateA);
      const bIsPast = isPast(dateB) && !isToday(dateB);

      if (aIsPast && !bIsPast) return 1;
      if (!aIsPast && bIsPast) return -1;

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
  return (
    <AnimatePresence mode='wait'>
      {optimisticBookings.length === 0 ? (
        <EmptyBooking />
      ) : (
        <motion.ul
          variants={Variants.slide.variant(0, -30)}
          initial={Variants.slide.key.hidden}
          animate={Variants.slide.key.visible}
          exit={Variants.slide.key.safelyHidden}
          transition={{ delayChildren: stagger(0.5) }}
          className='space-y-6'
        >
          {optimisticBookings.map((booking, index) => (
            <motion.li
              layout
              variants={Variants.slide.variant(0, -30)}
              key={booking.id}
            >
              <PriorityProvider isPriority={index === 0}>
                <Booking
                  booking={booking}
                  onDelete={() =>
                    updateOptimisticBookings({
                      type: 'delete',
                      payload: { bookingId: booking.id },
                    })
                  }
                />
              </PriorityProvider>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </AnimatePresence>
  );
}

function EmptyBooking() {
  return (
    <motion.div
      variants={Variants.slide.variant(0, -30)}
      initial={Variants.slide.key.hidden}
      animate={Variants.slide.key.visible}
      exit={Variants.slide.key.safelyHidden}
      key='fallback'
      className='text-lg'
    >
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <Bird />
          </EmptyMedia>
          <EmptyTitle>No reservations yet</EmptyTitle>
          <EmptyDescription>
            You have no reservations yet. Check out our luxury cabins.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link
            href={ROUTES.cabins.href}
            className='text-accent-500 animate-pulse underline'
          >
            luxury cabins &rarr;
          </Link>
        </EmptyContent>
      </Empty>
    </motion.div>
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
        cabin={{ id: booking.cabinId, ...result.data.cabin }}
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
