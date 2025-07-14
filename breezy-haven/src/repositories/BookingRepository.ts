import { supabase } from '@/lib';
import { PostgrestError } from '@supabase/supabase-js';
import { eachDayOfInterval } from 'date-fns';
import IRepository from './IRepository';
import { RawBooking } from './types';

export default class BookingRepository implements IRepository<RawBooking> {
  async getAll(): Promise<readonly RawBooking[] | PostgrestError> {
    const { data, error } = await supabase.from('bookings').select();

    if (error) {
      console.log('Error fetching bookings:', error);
      return error;
    }

    return data ?? [];
  }

  async getById(id: number): Promise<RawBooking | PostgrestError> {
    const { data, error } = await supabase
      .from('bookings')
      .select()
      .eq('id', id)
      .single();

    if (error) {
      console.log('Error fetching booking:', error);
      return error;
    }

    return data;
  }

  async get<K extends keyof RawBooking>(
    key: K,
    id: number
  ): Promise<RawBooking[K] | PostgrestError> {
    const { data, error } = await supabase
      .from('bookings')
      .select(key as string)
      .eq('id', id)
      .single();

    if (error) {
      console.log('Error fetching booking property:', error);
      return error;
    }

    return (data as unknown as Record<K, RawBooking[K]>)[key];
  }

  async create(
    item: Partial<RawBooking>
  ): Promise<RawBooking | PostgrestError> {
    const { data, error } = await supabase
      .from('bookings')
      .insert(item)
      .select()
      .single();

    if (error) {
      console.log('Error creating booking:', error);
      return error;
    }

    return data;
  }

  async update(
    id: number,
    updatedFields: Partial<RawBooking>
  ): Promise<RawBooking | PostgrestError> {
    const { data, error } = await supabase
      .from('bookings')
      .update(updatedFields)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.log('Error updating booking:', error);
      return error;
    }

    return data;
  }

  async delete(id: number): Promise<PostgrestError | null> {
    const { error } = await supabase.from('bookings').delete().eq('id', id);

    if (error) {
      console.log('Error deleting booking:', error);
      return error;
    }

    return null;
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
