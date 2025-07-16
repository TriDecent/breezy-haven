import {
  bookingRepository,
  cabinRepository,
  guestRepository,
  settingRepository,
  type Booking,
  type Cabin,
  type Guest,
  type RawBooking,
  type RawCabin,
  type RawGuest,
  type RawSetting,
  type Setting,
} from '@/repositories';
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
  cabinRepository,
  toCabin
);
export const bookingService = new EntityService<RawBooking, Booking>(
  bookingRepository,
  toBooking
);
export const guestService = new EntityService<RawGuest, Guest>(
  guestRepository,
  toGuest
);
export const settingService = new EntityService<RawSetting, Setting>(
  settingRepository,
  toSetting
);
