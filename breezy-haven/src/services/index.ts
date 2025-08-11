import { Auth } from '@/lib';
import { Repository } from '@/repositories';
import { BaseService } from './BaseService';
import BookingService from './BookingService';
import CabinService from './CabinService';
import GuestService from './GuestService';
import SettingService from './SettingService';

export const cabinService = new CabinService(
  new BaseService(new Repository('cabins'), () => Promise.resolve())
);

export const bookingService = new BookingService(
  new BaseService(new Repository('bookings'), async () => {
    await Auth.verifySession();
  })
);
export const unauthBookingService = new BookingService(
  new BaseService(new Repository('bookings'), () => Promise.resolve())
);

export const guestService = new GuestService(
  new BaseService(new Repository('guests'), async () => {
    await Auth.verifySession();
  })
);

export const settingService = new SettingService(
  new BaseService(new Repository('settings'), () => Promise.resolve())
);

export const guestSetupService = new GuestService(
  new BaseService(new Repository('guests'), () => Promise.resolve())
);

export { bookingSchema } from './schemas';
