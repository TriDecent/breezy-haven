import { supabase } from '@/lib';
import { PostgrestError } from '@supabase/supabase-js';
import { eachDayOfInterval } from 'date-fns';
import Repository from './Repository';
import { RawBooking } from './types';

export default class BookingRepository extends Repository<RawBooking> {
  constructor() {
    super('bookings');
  }

  async getByGuestId(
    guestId: number
  ): Promise<{ data: RawBooking[]; error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('bookings')
      .select()
      .eq('guestId', guestId)
      .order('startDate');
    return { data: data ?? [], error };
  }

  async getByCabinId(
    cabinId: number
  ): Promise<{ data: RawBooking[]; error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('cabinId', cabinId);
    return { data: data ?? [], error };
  }

  async getBookedDatesByCabinId(
    cabinId: number
  ): Promise<{ data: readonly Date[]; error: PostgrestError | null }> {
    const { data, error } = await this.getByCabinId(cabinId);

    return { data: getBookedDates(data), error: error };
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
