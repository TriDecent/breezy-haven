import { Repository } from '@/repositories';
import BookingService from './BookingService';
import CabinService from './CabinService';
import { BaseService } from './EntityService';
import GuestService from './GuestService';
import SettingService from './SettingService';

export const cabinService = new CabinService(
  new BaseService(new Repository('cabins'))
);
export const bookingService = new BookingService(
  new BaseService(new Repository('bookings'))
);
export const guestService = new GuestService(
  new BaseService(new Repository('guests'))
);
export const settingService = new SettingService(
  new BaseService(new Repository('settings'))
);
