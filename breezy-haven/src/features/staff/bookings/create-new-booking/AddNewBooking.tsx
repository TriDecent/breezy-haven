import { staffCabinService, staffGuestService } from '@/services';
import { errorHelper } from '@/shared/utils';
import { AddBookingForm } from './AddBookingForm';

export async function AddNewBooking() {
  const [guests, cabins] = await Promise.all([
    staffGuestService.getAll(),
    staffCabinService.getAll(),
  ]);

  if (guests.errors) throw errorHelper.handleError(guests.errors);
  if (cabins.errors) throw errorHelper.handleError(cabins.errors);

  return <AddBookingForm guests={guests.data} cabins={cabins.data} />;
}
