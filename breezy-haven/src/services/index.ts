import { Auth } from '@/lib';
import { Repository } from '@/repositories';
import {
  BookingSchema,
  CabinSchema,
  GuestSchema,
  NullableGuestSchema,
  SettingSchema,
} from '@/shared';
import { BaseService } from './BaseService';
import BookingService from './BookingService';
import CabinService from './CabinService';
import GuestService from './GuestService';
import SettingService from './SettingService';
export * from './countryService';
export * from './types';

export const cabinService = new CabinService(
  new BaseService(
    new Repository('cabins'),
    () => Promise.resolve(),
    CabinSchema
  )
);

export const bookingService = new BookingService(
  new BaseService(
    new Repository('bookings'),
    async () => {
      await Auth.verifySession();
    },
    BookingSchema
  )
);
export const unauthBookingService = new BookingService(
  new BaseService(
    new Repository('bookings'),
    () => Promise.resolve(),
    BookingSchema
  )
);

export const guestService = new GuestService(
  new BaseService(
    new Repository('guests'),
    async () => {
      await Auth.verifySession();
    },
    GuestSchema
  )
);

export const settingService = new SettingService(
  new BaseService(
    new Repository('settings'),
    () => Promise.resolve(),
    SettingSchema
  )
);

export const guestSetupService = new GuestService(
  new BaseService(
    new Repository('guests'),
    () => Promise.resolve(),
    NullableGuestSchema
  )
);

export const staffCabinService = new CabinService(
  new BaseService(
    new Repository('cabins'),
    () => {
      // TODO: perform verify staff permission
      return Promise.resolve();
    },
    CabinSchema
  )
);
