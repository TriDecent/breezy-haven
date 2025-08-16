import type { Booking, NullableBooking } from './Booking';
import type { Cabin, NullableCabin } from './Cabin';
import type { Guest, NullableGuest } from './Guest';
import type { NullableSetting, Setting } from './Setting';

export type Schemas =
  | Booking
  | Cabin
  | Guest
  | Setting
  | NullableBooking
  | NullableCabin
  | NullableGuest
  | NullableSetting
  | NullableBooking;
