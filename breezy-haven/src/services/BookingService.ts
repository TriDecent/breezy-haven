import { supabase } from '@/lib/supabase';
import { DTOBooking } from '@/repositories';
import { PostgrestError } from '@supabase/supabase-js';
import { eachDayOfInterval } from 'date-fns';
import { IService, ServiceReturnType } from './BaseService';

export default class BookingService implements IService<DTOBooking> {
  constructor(private readonly _service: IService<DTOBooking>) {}
  async delete(
    id: number
  ): ServiceReturnType<DTOBooking | null, PostgrestError | null> {
    const { data, error } = await this._service.delete(id);

    return { data, error };
  }

  getAll() {
    return this._service.getAll();
  }
  getById(id: number) {
    return this._service.getById(id);
  }
  create(item: DTOBooking) {
    return this._service.create(item);
  }
  update(id: number, updatedFields: DTOBooking) {
    return this._service.update(id, updatedFields);
  }

  async getByGuestId(
    guestId: number
  ): Promise<{ data: DTOBooking[]; error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('bookings')
      .select()
      .eq('guestId', guestId)
      .order('startDate');

    return {
      data: data ?? [],
      error: error,
    };
  }

  async getByCabinId(
    cabinId: number
  ): Promise<{ data: DTOBooking[]; error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('cabinId', cabinId);

    return {
      data: data ?? [],
      error: error,
    };
  }

  public async getBookedDatesByCabinId(
    cabinId: number
  ): Promise<{ data: readonly Date[]; error: PostgrestError | null }> {
    const { data, error } = await this.getByCabinId(cabinId);

    return { data: this.getBookedDates(data), error: error };
  }

  private getBookedDates(bookings: DTOBooking[]): readonly Date[] {
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
}
