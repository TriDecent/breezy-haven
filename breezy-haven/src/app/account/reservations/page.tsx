import { BookingList } from '@/features/account/reservations';
import { Auth } from '@/lib';
import { bookingService } from '@/services';
import { errorHelper, ROUTES } from '@/shared';
import { Metadata } from 'next';

export const metadata: Metadata = ROUTES.account.nested.reservations.metadata;

export default async function ReservationsPage() {
  const session = await Auth.verifySession();

  const { data: bookings, errors: bookingsError } =
    await bookingService.getByGuestId(session.main.id);

  if (bookingsError) throw errorHelper.handleError(bookingsError);

  return (
    <div>
      <h1 className='text-accent-400 mb-4 text-2xl font-semibold tracking-widest lg:text-4xl'>
        Your reservations
      </h1>

      <BookingList bookings={bookings} />
    </div>
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
