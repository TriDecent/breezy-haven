import { BookingsList } from '@/features/staff/bookings';
import { ROUTES, Spinner } from '@/shared';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = ROUTES.staff.nested.bookings.metadata;

export default function BookingsPage() {
  // TODO: verify staff authentication

  return (
    <section>
      <h1 className='text-accent-500 mb-4 text-2xl font-semibold tracking-widest'>
        Bookings
      </h1>

      <Suspense fallback={<Spinner />}>
        <BookingsList />
      </Suspense>
    </section>
  );
}
