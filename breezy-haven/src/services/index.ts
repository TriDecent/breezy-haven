import { Auth } from '@/lib';
import { Repository } from '@/repositories';
import {
  BookingSchema,
  CabinSchema,
  GuestSchema,
  SettingSchema,
} from '@/shared';
import { BaseService } from './BaseService';
import { BaseStaffService } from './BaseStaffService';
import BookingService from './BookingService';
import CabinService from './CabinService';
import CabinStaffService from './CabinStaffService';
import GuestService from './GuestService';
import SettingService from './SettingService';
import SettingStaffService from './SettingStaffService';
export * from './countryService';
export * from './types';

const cabinRepository = new Repository('cabins');
const bookingRepository = new Repository('bookings');
const guestRepository = new Repository('guests');
const settingRepository = new Repository('settings');

const verifyUnauthAsync = () => Promise.resolve();
const verifyAuthAsync = async () => {
  await Auth.verifySession();
};
const verifyStaffAuthAsync = () => Promise.resolve();

export const unauthCabinService = new CabinService(
  new BaseService(cabinRepository, verifyUnauthAsync, CabinSchema)
);

export const bookingService = new BookingService(
  new BaseService(bookingRepository, verifyAuthAsync, BookingSchema)
);

export const unauthBookingService = new BookingService(
  new BaseService(bookingRepository, verifyUnauthAsync, BookingSchema)
);

export const guestService = new GuestService(
  new BaseService(guestRepository, verifyAuthAsync, GuestSchema)
);

export const unauthSettingService = new SettingService(
  new BaseService(settingRepository, verifyUnauthAsync, SettingSchema)
);

export const unauthGuestService = new GuestService(
  new BaseService(guestRepository, verifyUnauthAsync, GuestSchema)
);

export const staffCabinService = new CabinStaffService(
  new BaseStaffService(
    new BaseService(cabinRepository, verifyStaffAuthAsync, CabinSchema),
    cabinRepository
  )
);

export const staffSettingService = new SettingStaffService(
  new BaseStaffService(
    new BaseService(settingRepository, verifyStaffAuthAsync, SettingSchema),
    settingRepository
  )
);
