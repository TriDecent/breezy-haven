import {
  staffCabinService,
  staffGuestService,
  staffSettingService,
} from '@/services';
import { errorHelper } from '@/shared/utils';
import { AddBookingForm } from './AddBookingForm';

export async function AddNewBooking() {
  const [guests, cabins, settings] = await Promise.all([
    staffGuestService.getAll(),
    staffCabinService.getAll(),
    staffSettingService.getAll(),
  ]);

  if (guests.errors) throw errorHelper.handleError(guests.errors);
  if (cabins.errors) throw errorHelper.handleError(cabins.errors);
  if (settings.errors) throw errorHelper.handleError(settings.errors);

  const setting = settings.data.at(0);
  if (!setting) throw new Error('Configuration error!');

  return (
    <AddBookingForm
      guests={guests.data}
      cabins={cabins.data}
      setting={setting}
    />
  );
}
