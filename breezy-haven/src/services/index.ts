import type {
  Booking,
  Cabin,
  Guest,
  RawBooking,
  RawCabin,
  RawGuest,
  RawSetting,
  Setting,
} from '@/repositories';
import BookingRepository from '@/repositories/BookingRepository';
import CabinRepository from '@/repositories/CabinRepository';
import GuestRepository from '@/repositories/GuestRepository';
import SettingRepository from '@/repositories/SettingRepository';
import { EntityService } from './EntityService';

const toCabin = (raw: RawCabin): Cabin => ({
  id: raw.id,
  name: raw.name ?? 'Unknown',
  maxCapacity: raw.maxCapacity ?? 1,
  regularPrice: raw.regularPrice ?? 0,
  discount: raw.discount ?? 0,
  image: raw.image ?? '/default.jpg',
  description: raw.description ?? '',
  created_at: raw.created_at,
});

const toBooking = (raw: RawBooking): Booking => ({
  id: raw.id,
  cabinId: raw.cabinId ?? 0,
  cabinPrice: raw.cabinPrice ?? 0,
  created_at: raw.created_at,
  endDate: raw.endDate ?? '',
  extrasPrice: raw.extrasPrice ?? 0,
  guestId: raw.guestId ?? 0,
  hasBreakfast: raw.hasBreakfast ?? false,
  isPaid: raw.isPaid ?? false,
  numGuests: raw.numGuests ?? 1,
  numNights: raw.numNights ?? 1,
  observations: raw.observations ?? '',
  startDate: raw.startDate ?? '',
  status: raw.status ?? 'pending',
  totalPrice: raw.totalPrice ?? 0,
});

const toGuest = (raw: RawGuest): Guest => ({
  id: raw.id,
  fullName: raw.fullName ?? 'Unknown',
  email: raw.email ?? '',
  nationality: raw.nationality ?? '',
  nationalID: raw.nationalID ?? '',
  countryFlag: raw.countryFlag ?? '',
  created_at: raw.created_at,
});

const toSetting = (raw: RawSetting): Setting => ({
  id: raw.id,
  breakfastPrice: raw.breakfastPrice ?? 0,
  maxBookingLength: raw.maxBookingLength ?? 1,
  maxGuestPerBooking: raw.maxGuestPerBooking ?? 1,
  minBookingLength: raw.minBookingLength ?? 1,
  created_at: raw.created_at,
});

export const cabinService = new EntityService<RawCabin, Cabin>(
  new CabinRepository(),
  toCabin
);
export const bookingService = new EntityService<RawBooking, Booking>(
  new BookingRepository(),
  toBooking
);
export const guestService = new EntityService<RawGuest, Guest>(
  new GuestRepository(),
  toGuest
);
export const settingService = new EntityService<RawSetting, Setting>(
  new SettingRepository(),
  toSetting
);
