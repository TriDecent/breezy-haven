import { BookingEditForm } from '@/features/account/profile';
import { Auth } from '@/lib';
import { bookingSchema, bookingService } from '@/services';
import { parseISO } from 'date-fns';
import type { Metadata } from 'next';
import z from 'zod';

const paramsSchema = z.object({ bookingId: z.coerce.number() });
const bookingArraySchema = z.array(bookingSchema);

type PageParams = {
  params: Promise<{ bookingId?: string }>;
};

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const paramsResult = paramsSchema.safeParse(await params);

  if (!paramsResult.success) throw new Error('Invalid booking id');

  return {
    title: `Editing booking ${paramsResult.data.bookingId}`,
  };
}

export default async function BookingEditPage({ params }: PageParams) {
  const paramsResult = paramsSchema.safeParse(await params);

  if (!paramsResult.success) throw new Error('Invalid booking id');
  const { bookingId } = paramsResult.data;

  const session = await Auth.verifySession();

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
      <BookingEditForm
        bookingId={needsEditedBooking.id}
        cabin={needsEditedBooking.cabin}
        guestCount={needsEditedBooking.numGuests}
        startDate={parseISO(needsEditedBooking.startDate)}
        endDate={parseISO(needsEditedBooking.endDate)}
        observations={needsEditedBooking.observations}
      />
    </div>
  );
}
