import { Booking, ReservationCard } from '@/features/account/reservations';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'My Reservations',
};

export default function Page() {
  // CHANGE
  const bookings: readonly Booking[] = [];

  return (
    <div>
      <h1 className='text-accent-400 mb-4 text-xl tracking-widest lg:text-4xl'>
        Your reservations
      </h1>

      {bookings.length === 0 ? (
        <p className='text-lg'>
          You have no reservations yet. Check out our{' '}
          <Link
            href='/cabins'
            className='text-accent-500 animate-pulse underline'
          >
            luxury cabins &rarr;
          </Link>
        </p>
      ) : (
        <ul className='space-y-6'>
          {bookings.map(booking => (
            <li key={booking.id}>
              <ReservationCard booking={booking} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
