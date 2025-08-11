import { ReservationCard } from '@/features/account/reservations';
import { Auth } from '@/lib';
import { bookingSchema, bookingService } from '@/services';
import { METADATA } from '@/shared';
import { ROUTES } from '@/shared/constants/ROUTES';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { $ZodIssue } from 'zod/v4/core';

export const metadata: Metadata = METADATA.account.nested.reservations.metadata;

export default async function ReservationsPage() {
  const session = await Auth.getFullSessionAsync();

  if (!session.main) redirect(ROUTES.login.href);

  const { data: bookings, error: bookingsError } =
    await bookingService.getByGuestId(session.main.id);

  if (bookingsError)
    throw new Error(`${bookingsError.code}: ${bookingsError.message}`);

  return (
    <div>
      <h1 className='text-accent-400 mb-4 text-2xl font-semibold tracking-widest lg:text-4xl'>
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
          {bookings.map(booking => {
            const result = bookingSchema.safeParse(booking);
            if (result.success) {
              return (
                <li key={booking.id}>
                  <ReservationCard
                    booking={result.data}
                    cabin={result.data.cabin}
                  />
                </li>
              );
            }

            return (
              <li
                key={booking.id}
                className='rounded bg-red-100 p-4 text-red-700'
              >
                <Fallback issues={result.error.issues} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Fallback({ issues }: { issues: $ZodIssue[] }) {
  return (
    <>
      <div className='font-bold'>Invalid booking data</div>
      <div className='mt-1 text-xs'>
        {issues.map((err, idx) => (
          <div key={idx}>
            <span className='font-mono'>{err.path.join('.')}</span>:{' '}
            {err.message}
          </div>
        ))}
      </div>
    </>
  );
}

// const { data: bookings, error: bookingsError } = {
//   data: [
//     {
//       id: 47,
//       created_at: '2025-07-03T14:17:08.925+00:00',
//       startDate: '2025-07-06T00:00:00',
//       endDate: '2025-07-11T00:00:00',
//       numNights: 5,
//       numGuests: 9,
//       cabinPrice: 7000,
//       extrasPrice: 675,
//       totalPrice: 7675,
//       status: 'checked-in',
//       hasBreakfast: true,
//       isPaid: true,
//       observations:
//         'My wife has a gluten allergy so I would like to request a gluten-free breakfast if possible',
//       cabinId: 25,
//       guestId: 124,
//       cabin: {
//         name: '007',
//         image:
//           'https://aljspbbvlhvassukqbyt.supabase.co/storage/v1/object/public/cabin-images/cabin-007.jpg',
//       },
//     },
//     {
//       id: 46,
//       created_at: '2025-05-17T14:17:08.925+00:00',
//       startDate: '2025-08-12T00:00:00',
//       endDate: '2025-08-17T00:00:00',
//       numNights: 5,
//       numGuests: 6,
//       cabinPrice: 2500,
//       extrasPrice: 450,
//       totalPrice: 2950,
//       status: 'unconfirmed',
//       hasBreakfast: true,
//       isPaid: true,
//       observations: '',
//       cabinId: 24,
//       guestId: 124,
//       cabin: {
//         name: '008',
//         image:
//           'https://aljspbbvlhvassukqbyt.supabase.co/storage/v1/object/public/cabin-images/cabin-008.jpg',
//       },
//     },
//   ],
//   error: null,
// };
