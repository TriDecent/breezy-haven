import { Auth } from '@/features/auth';
import { FileRepository, Repository } from '@/repositories';
import {
  BookingSchema,
  CabinSchema,
  GuestSchema,
  SettingSchema,
  StaffSchema,
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
const cabinRepository = new Repository('cabins');
const bookingRepository = new Repository('bookings');
const guestRepository = new Repository('guests');
const settingRepository = new Repository('settings');
const staffRepository = new Repository('staff');

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

export const unauthCabinService = new CabinService(
  new BaseService(cabinRepository, verifyUnauthAsync, CabinSchema)
);

export const bookingService = new BookingService(
  new BaseService(bookingRepository, verifyGuestAuthAsync, BookingSchema)
);

export const unauthBookingService = new BookingService(
  new BaseService(bookingRepository, verifyUnauthAsync, BookingSchema)
);

export const guestService = new GuestService(
  new BaseService(guestRepository, verifyGuestAuthAsync, GuestSchema)
);

export const unauthSettingService = new SettingService(
  new BaseService(settingRepository, verifyUnauthAsync, SettingSchema)
);

export const unauthGuestService = new GuestService(
  new BaseService(guestRepository, verifyUnauthAsync, GuestSchema)
);

export const staffGuestService = new GuestService(
  new BaseService(guestRepository, verifyStaffAuthAsync, GuestSchema)
);

export const staffCabinService = new CabinService(
  new BaseService(cabinRepository, verifyStaffAuthAsync, CabinSchema)
);

export const staffSettingService = new SettingService(
  new BaseService(settingRepository, verifyStaffAuthAsync, SettingSchema)
);

export const staffBookingService = new BookingService(
  new BaseService(bookingRepository, verifyStaffAuthAsync, BookingSchema)
);

export const unauthStaffService = new StaffService(
  new BaseService(staffRepository, verifyUnauthAsync, StaffSchema)
);

export const staffService = new StaffService(
  new BaseService(staffRepository, verifyStaffAuthAsync, StaffSchema)
);

export const fileService = new FileService(
  verifyStaffAuthAsync,
  fileRepository
);
