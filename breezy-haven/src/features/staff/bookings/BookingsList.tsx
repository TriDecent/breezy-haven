import { staffBookingService, type BookingWithRelations } from '@/services';
import { errorHelper } from '@/shared';
import { isSameDay, parseISO } from 'date-fns';
import { BookingTable } from './BookingTable';
import type { BookingQuery } from './QuerySchema';

export async function BookingsList({
  query,
}: {
  query: BookingQuery['query'];
}) {
  const { data, errors } =
    await staffBookingService.getAllBookingsWithRelations();

  if (errors) throw errorHelper.handleError(errors);

  return (
    <BookingTable bookings={[...filterBookingsBasedOnQuery(data, query)]} />
  );
}

function filterBookingsBasedOnQuery(
  bookings: readonly BookingWithRelations[],
  query: BookingQuery['query']
): readonly BookingWithRelations[] {
  switch (query) {
    case 'checked-in':
    case 'checked-out':
    case 'unconfirmed':
      return bookings.filter(booking => booking.status === query);

    case 'today-checkin':
      return bookings.filter(booking =>
        isSameDay(parseISO(booking.startDate), Date.now())
      );

    case 'today-checkout':
      return bookings.filter(booking =>
        isSameDay(parseISO(booking.endDate), Date.now())
      );

    default:
      return bookings;
  }
}
