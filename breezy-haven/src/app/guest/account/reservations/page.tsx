import { BookingList } from '@/features/guest/account/reservations';
import { Auth } from '@/lib';
import { bookingService } from '@/services';
import { ROUTES } from '@/shared/constants';
import { errorHelper } from '@/shared/utils';

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
