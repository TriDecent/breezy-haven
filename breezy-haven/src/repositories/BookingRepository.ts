import { supabase } from '@/lib';
import { PostgrestError } from '@supabase/supabase-js';
import { eachDayOfInterval } from 'date-fns';
import Repository from './Repository';
import { RawBooking } from './types';

export default class BookingRepository extends Repository<RawBooking> {
  constructor() {
    super('bookings');
  }

  async getByGuestId(guestId: number): Promise<RawBooking[] | PostgrestError> {
    const { data, error } = await supabase
      .from('bookings')
      .select()
      .eq('guestId', guestId)
      .order('startDate');
    if (error) return error;
    return data ?? [];
  }

  async getByCabinId(cabinId: number): Promise<RawBooking[] | PostgrestError> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('cabinId', cabinId);
    if (error) return error;
    return data ?? [];
  }

  async getBookedDatesByCabinId(
    cabinId: number
  ): Promise<readonly Date[] | PostgrestError> {
    const raw = await this.getByCabinId(cabinId);
    if ('code' in raw) return raw;
    return getBookedDates(raw);
  }
}

function getBookedDates(bookings: RawBooking[]): readonly Date[] {
  return bookings
    .map(booking => {
      if (booking.startDate && booking.endDate) {
        return eachDayOfInterval({
          start: new Date(booking.startDate),
          end: new Date(booking.endDate),
        });
      }
      return [];
    })
    .flat();
}
