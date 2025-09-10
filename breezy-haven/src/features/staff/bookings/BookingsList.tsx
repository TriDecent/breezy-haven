import { staffBookingService } from '@/services';
import { errorHelper } from '@/shared';
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
    <BookingTable
      bookings={
        query === 'all' ? data : data.filter(item => item.status === query)
      }
    />
  );
}
