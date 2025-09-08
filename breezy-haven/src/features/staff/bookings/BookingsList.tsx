import { staffBookingService } from '@/services';
import { errorHelper } from '@/shared';
import { BookingTable } from './BookingTable';

export async function BookingsList() {
  const { data, errors } =
    await staffBookingService.getAllBookingsWithRelations();

  if (errors) throw errorHelper.handleError(errors);

  return <BookingTable bookings={data} />;
}
