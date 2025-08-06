export type {
  Country,
  DTOBooking,
  DTOCabin,
  DTOGuest,
  DTOSetting,
} from './types';

import type { DTOBooking, DTOCabin, DTOGuest, DTOSetting } from './types';

export { Repository } from './Repository';
export type { IRepository } from './Repository';

type NonNullableObject<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

export type Booking = NonNullableObject<DTOBooking>;
export type Cabin = NonNullableObject<DTOCabin>;
export type Guest = NonNullableObject<DTOGuest>;
export type Setting = NonNullableObject<DTOSetting>;
