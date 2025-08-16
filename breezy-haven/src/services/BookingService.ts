import { supabase } from '@/lib/supabase';
import { DTOBooking } from '@/repositories';
import { BookingSchema, type Booking, type NullableBooking } from '@/shared';
import { PostgrestError } from '@supabase/supabase-js';
import { eachDayOfInterval } from 'date-fns';
import z from 'zod';
import { IService } from './BaseService';
import type { DatabaseError } from './types';

const CabinInfoSchema = z.object({
  name: z.string(),
  image: z.string(),
  maxCapacity: z.number(),
});

const BookingWithCabinSchema = BookingSchema.extend({
  cabins: CabinInfoSchema,
});

export default class BookingService<T extends Booking | NullableBooking>
  implements IService<DTOBooking, T>
{
  constructor(private readonly _service: IService<DTOBooking, T>) {}
  handleRepositoryResultArray(
    action: () => Promise<{ data: unknown; error: PostgrestError | null }>
  ) {
    return this._service.handleRepositoryResultArray(action);
  }
  handleRepositoryResult(
    action: () => Promise<{ data: unknown; error: PostgrestError | null }>
  ) {
    return this._service.handleRepositoryResult(action);
  }
  verifyPermission(): Promise<void> {
    return this._service.verifyPermission();
  }
  getAll() {
    return this._service.getAll();
  }
  getById(id: number) {
    return this._service.getById(id);
  }
  create(item: Partial<DTOBooking>) {
    return this._service.create(item);
  }
  update(id: number, updatedFields: Partial<DTOBooking>) {
    return this._service.update(id, updatedFields);
  }
  delete(id: number) {
    return this._service.delete(id);
  }

  async getByGuestId(guestId: number) {
    await this._service.verifyPermission();

    const query = supabase
      .from('bookings')
      .select(
        `
      *,
      cabins(name, image, maxCapacity)
    `
      )
      .eq('guestId', guestId)
      .order('startDate');

    const { data, error } = await query;

    if (error)
      return { data: null, errors: { type: 'database' as const, db: error } };
    if (!Array.isArray(data))
      return {
        data: null,
        errors: { type: 'unexpected' as const, message: 'Data is not array' },
      };

    const validItems = [];
    let corruptedCount = 0;
    for (const item of data) {
      const result = BookingWithCabinSchema.safeParse(item);
      if (result.success) validItems.push(result.data);
      else corruptedCount++;
    }

    if (data.length !== 0 && validItems.length === 0)
      return {
        data: null,
        errors: { type: 'unexpected' as const, message: 'All data corrupted' },
      };

    return {
      data: validItems.map(({ cabins, ...booking }) => ({
        ...booking,
        cabin: cabins,
      })),
      errors: null,
      warnings:
        corruptedCount > 0
          ? { corrupted: corruptedCount, total: data.length }
          : undefined,
    };
  }

  async getByCabinId(
    cabinId: number
  ): Promise<{ data: DTOBooking[]; error: PostgrestError | null }> {
    await this._service.verifyPermission();

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
  ): Promise<
    | { data: readonly Date[]; errors: null }
    | { data: null; errors: DatabaseError }
  > {
    await this._service.verifyPermission();

    const { data, error } = await this.getByCabinId(cabinId);

    if (error) {
      return { data: null, errors: { type: 'database' as const, db: error } };
    }

    return { data: this.getBookedDates(data), errors: null };
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
