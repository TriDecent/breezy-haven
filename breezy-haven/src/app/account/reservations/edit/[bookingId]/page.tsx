import { BookingEditForm } from '@/features/account/profile';
import { Auth } from '@/lib';
import { bookingSchema, bookingService } from '@/services';
import { ROUTES } from '@/shared';
import { redirect } from 'next/navigation';
import z from 'zod';

const paramsSchema = z.object({ bookingId: z.coerce.number() });
const bookingArraySchema = z.array(bookingSchema);

export default async function BookingEditPage({
  params,
}: {
  params: Promise<{ bookingId?: string }>;
}) {
  const paramsResult = paramsSchema.safeParse(await params);

  if (!paramsResult.success) throw new Error('Invalid booking id');
  const { bookingId } = paramsResult.data;

  const session = await Auth.getFullSessionAsync();

  if (!session.main) redirect(ROUTES.login.href);

  const { data: bookings, error: bookingsError } =
    await bookingService.getByGuestId(session.main.id);

  if (bookingsError)
    throw new Error(`${bookingsError.code}: ${bookingsError.message}`);

  const bookingResult = bookingArraySchema.safeParse(bookings);

  if (!bookingResult.success)
    throw new Error(
      `Something is wrong with your editing! ${bookingResult.error.issues[0]}`
    );

  const needsEditedBooking = bookingResult.data.find(
    booking => booking.id === paramsResult.data.bookingId
  );

  if (!needsEditedBooking)
    throw new Error('You do not have permission to edit this booking!');

  return (
    <div>
      <h2 className='text-accent-400 mb-7 text-xl font-semibold tracking-wide'>
        Edit Reservation #{bookingId}
      </h2>
      <BookingEditForm cabin={needsEditedBooking.cabin} />
    </div>
  );
}
