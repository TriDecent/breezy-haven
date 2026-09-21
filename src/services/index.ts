import { Auth } from '@/features/auth';
import {
  DTOBooking,
  DTOCabin,
  DTOSetting,
  DTOStaff,
  FileRepository,
  Repository,
  type DTOGuest,
} from '@/repositories';
import {
  Booking,
  BookingSchema,
  CabinSchema,
  Guest,
  GuestSchema,
  NullableGuestSchema,
  Setting,
  SettingSchema,
  Staff,
  StaffSchema,
  type Cabin,
  type NullableGuest,
} from '@/shared/schemas';
import { cache } from 'react';
import { BaseService } from './BaseService';
import BookingService from './BookingService';
import CabinService from './CabinService';
import { FileService } from './FileService';
import GuestService from './GuestService';
import SettingService from './SettingService';
import StaffService from './StaffService';
export { type BookingWithRelations } from './BookingService';
export * from './country-service';
export * from './types';

const cabinRepository = new Repository<DTOCabin>('cabins');
const bookingRepository = new Repository<DTOBooking>('bookings');
const guestRepository = new Repository<DTOGuest>('guests');
const settingRepository = new Repository<DTOSetting>('settings');
const staffRepository = new Repository<DTOStaff>('staff');

const fileRepository = new FileRepository();

const verifyUnauthAsync = () => Promise.resolve();
const verifyGuestAuthAsync = cache(async () => {
  await Auth.guest.verifySession();
});

// ** Helps staff refresh the access token if the refresh token is still valid.
// ** However, if the refresh token is revoked or invalid, the client may not be redirected
// ** because toast.promise swallows the error from the server action.
const verifyStaffAuthAsync = cache(() =>
  Auth.staff.ensureStaffIsAuthenticatedAsync()
);

export const unauthCabinService = new CabinService<Cabin>(
  new BaseService<DTOCabin, Cabin>(
    cabinRepository,
    verifyUnauthAsync,
    CabinSchema
  )
);

export const bookingService = new BookingService<Booking>(
  new BaseService<DTOBooking, Booking>(
    bookingRepository,
    verifyGuestAuthAsync,
    BookingSchema
  )
);

export const unauthBookingService = new BookingService<Booking>(
  new BaseService<DTOBooking, Booking>(
    bookingRepository,
    verifyUnauthAsync,
    BookingSchema
  )
);

export const guestService = new GuestService<Guest>(
  new BaseService<DTOGuest, Guest>(
    guestRepository,
    verifyGuestAuthAsync,
    GuestSchema
  )
);

export const unauthSettingService = new SettingService<Setting>(
  new BaseService<DTOSetting, Setting>(
    settingRepository,
    verifyUnauthAsync,
    SettingSchema
  )
);

export const unauthGuestService = new GuestService<NullableGuest>(
  new BaseService<DTOGuest, NullableGuest>(
    guestRepository,
    verifyUnauthAsync,
    NullableGuestSchema
  ) // Use NullableSchema to allow 'null' values for setup purposes.
);

export const staffGuestService = new GuestService<Guest>(
  new BaseService<DTOGuest, Guest>(
    guestRepository,
    verifyStaffAuthAsync,
    GuestSchema
  )
);

export const staffCabinService = new CabinService<Cabin>(
  new BaseService<DTOCabin, Cabin>(
    cabinRepository,
    verifyStaffAuthAsync,
    CabinSchema
  )
);

export const staffSettingService = new SettingService<Setting>(
  new BaseService<DTOSetting, Setting>(
    settingRepository,
    verifyStaffAuthAsync,
    SettingSchema
  )
);

export const staffBookingService = new BookingService<Booking>(
  new BaseService<DTOBooking, Booking>(
    bookingRepository,
    verifyStaffAuthAsync,
    BookingSchema
  )
);

export const unauthStaffService = new StaffService<Staff>(
  new BaseService<DTOStaff, Staff>(
    staffRepository,
    verifyUnauthAsync,
    StaffSchema
  )
);

export const staffService = new StaffService<Staff>(
  new BaseService<DTOStaff, Staff>(
    staffRepository,
    verifyStaffAuthAsync,
    StaffSchema
  )
);

export const fileService = new FileService(
  verifyStaffAuthAsync,
  fileRepository
);
