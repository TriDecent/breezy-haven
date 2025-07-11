
export type {
  Country,
  RawBooking,
  RawCabin,
  RawGuest,
  RawSetting,
} from './types';
import type { RawBooking, RawCabin, RawGuest, RawSetting } from './types';

type NonNullableObject<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

export type Booking = NonNullableObject<RawBooking>;
export type Cabin = NonNullableObject<RawCabin>;
export type Guest = NonNullableObject<RawGuest>;
export type Setting = NonNullableObject<RawSetting>;

import BookingRepository from './BookingRepository';
import CabinRepository from './CabinRepository';
import GuestRepository from './GuestRepository';
import SettingRepository from './SettingRepository';

export const cabinRepository = new CabinRepository();
export const bookingRepository = new BookingRepository();
export const guestRepository = new GuestRepository();
export const settingRepository = new SettingRepository();
