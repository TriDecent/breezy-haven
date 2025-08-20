export type { DTOBooking, DTOCabin, DTOGuest, DTOSetting } from './types';

export { Repository } from './Repository';
export type { IRepository } from './Repository';

export type NonNullableObject<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};
