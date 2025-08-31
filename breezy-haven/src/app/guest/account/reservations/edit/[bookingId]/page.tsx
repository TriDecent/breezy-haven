import { BookingEditForm } from '@/features/guest/account/profile';
import { Auth } from '@/lib';
import { bookingService, unauthSettingService } from '@/services';
import { errorHelper } from '@/shared';
import { parseISO } from 'date-fns';
import type { Metadata } from 'next';
import z from 'zod';

const paramsSchema = z.object({ bookingId: z.coerce.number() });

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

  const { data: bookings, errors: bookingsErrors } =
    await bookingService.getByGuestId(session.main.id);

  if (bookingsErrors) throw errorHelper.handleError(bookingsErrors);

  const needsEditedBooking = bookings.find(
    booking => booking.id === paramsResult.data.bookingId
  );

  if (!needsEditedBooking)
    throw new Error('You do not have permission to edit this booking!');

  const [bookedDatesResult, settingResult] = await Promise.all([
    bookingService.getBookedDatesByCabinId(needsEditedBooking.cabinId),
    unauthSettingService.getDefaultSettings(),
  ]);

  if (bookedDatesResult.errors)
    throw errorHelper.handleError(bookedDatesResult.errors);

  if (settingResult.errors) throw errorHelper.handleError(settingResult.errors);

  return (
    <div>
      <h2 className='text-accent-400 mb-7 text-xl font-semibold tracking-wide'>
        Edit Reservation #{bookingId}
      </h2>
      <BookingEditForm
        booking={{
          bookingId: needsEditedBooking.id,
          guestCount: needsEditedBooking.numGuests,
          startDate: parseISO(needsEditedBooking.startDate),
          endDate: parseISO(needsEditedBooking.endDate),
          observations: needsEditedBooking.observations,
        }}
        cabin={{
          maxCapacity: needsEditedBooking.cabin.maxCapacity,
          alreadyBookedDates: bookedDatesResult.data,
        }}
        rules={{
          minBookingDaysCount: settingResult.data.minBookingLength,
          maxBookingDaysCount: settingResult.data.maxBookingLength,
        }}
      />
    </div>
  );
}
