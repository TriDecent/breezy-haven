import type { Booking, NullableBooking } from './Booking';
import type { Cabin, NullableCabin } from './Cabin';
import type { Guest, NullableGuest } from './Guest';
import type { NullableRefreshToken, RefreshToken } from './RefreshToken';
import type { NullableSetting, Setting } from './Setting';
import type { NullableStaff, Staff } from './Staff';

export type Schemas =
  | Booking
  | Cabin
  | Guest
  | Setting
  | Staff
  | RefreshToken
  | NullableBooking
  | NullableCabin
  | NullableGuest
  | NullableSetting
  | NullableBooking
  | NullableStaff
  | NullableRefreshToken;
