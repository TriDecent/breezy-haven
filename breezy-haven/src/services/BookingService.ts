import { supabase } from '@/lib/supabase';
import { DTOBooking } from '@/repositories';

import {
  BookingSchema,
  CabinSchema,
  GuestSchema,
  type Booking,
  type NullableBooking,
} from '@/shared/schemas';
import { PostgrestError } from '@supabase/supabase-js';
import { eachDayOfInterval } from 'date-fns';
import z from 'zod';
import { IService } from './BaseService';
import type {
  DatabaseError,
  GetAllServiceReturnType,
  ServiceReturnType,
} from './types';

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

  async getByGuestId(
    guestId: number
  ): Promise<GetAllServiceReturnType<BookingWithCabinInfo>> {
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

    if (error) return { data: null, errors: { type: 'database', db: error } };

    const validateResult = this.validateItems(data, BookingWithCabinInfoSchema);

    if (validateResult.length === 0 && data.length > 0)
      return {
        data: null,
        errors: {
          type: 'unexpected',
          message: 'All data corrupted',
        },
      };

    return {
      data: validateResult.map(item => ({
        ...item,
        cabin: item.cabins,
      })),
      errors: null,
      warnings:
        data.length - validateResult.length > 0
          ? {
              corruptedCount: data.length - validateResult.length,
              total: data.length,
            }
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

  async getBookingWithRelationsById(
    id: Booking['id']
  ): Promise<ServiceReturnType<BookingWithRelations>> {
    await this._service.verifyPermission();

    const query = supabase
      .from('bookings')
      .select(
        `
        *,
        cabins(id, name, image),
        guests(fullName, email, countryFlag, nationalID)
      `
      )
      .eq('id', id)
      .single();
    const { data, error } = await query;

    if (error)
      return {
        data: null,
        errors: {
          type: 'database',
          db: error,
        },
      };

    const parsedResult = BookingWithRelationsSchema.safeParse(data);
    if (!parsedResult.success)
      return {
        data: null,
        errors: {
          type: 'validation',
          fields: z.flattenError(parsedResult.error).fieldErrors,
        },
      };
    return {
      data: {
        ...parsedResult.data,
        cabin: parsedResult.data.cabins,
        guest: parsedResult.data.guests,
      },
      errors: null,
    };
  }

  async getAllBookingsWithRelations(): Promise<
    GetAllServiceReturnType<BookingWithRelations>
  > {
    await this._service.verifyPermission();

    const query = supabase.from('bookings').select(
      `
        *,
        cabins(id, name, image),
        guests(fullName, email, countryFlag, nationalID)
      `
    );
    const { data, error } = await query;

    if (error)
      return {
        data: null,
        errors: {
          type: 'database',
          db: error,
        },
      };

    const validateResult = this.validateItems(data, BookingWithRelationsSchema);

    if (validateResult.length === 0 && data.length > 0)
      return {
        data: null,
        errors: {
          type: 'unexpected',
          message: 'All data corrupted',
        },
      };

    return {
      data: validateResult.map(item => ({
        ...item,
        cabin: item.cabins,
        guest: item.guests,
      })),
      errors: null,
      warnings:
        data.length - validateResult.length > 0
          ? {
              corruptedCount: data.length - validateResult.length,
              total: data.length,
            }
          : undefined,
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

  private validateItems<T>(items: unknown[], schema: z.ZodType<T>): T[] {
    const validItems: T[] = [];

    for (const item of items) {
      const parsedResult = schema.safeParse(item);
      if (!parsedResult.success) continue;

      validItems.push(parsedResult.data);
    }

    return validItems;
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

const CabinBasicInfoSchema = CabinSchema.pick({
  name: true,
  image: true,
  maxCapacity: true,
});

const BookingWithCabinInfoSchema = BookingSchema.extend({
  cabins: CabinBasicInfoSchema,
});

type BookingWithCabinInfo = Booking & {
  cabin: z.infer<typeof CabinBasicInfoSchema>;
};

const CabinForBookingSchema = CabinSchema.pick({
  id: true,
  name: true,
  image: true,
});
const GuestBasicInfoSchema = GuestSchema.pick({
  fullName: true,
  email: true,
  countryFlag: true,
  nationalID: true,
});

const BookingWithRelationsSchema = BookingSchema.extend({
  cabins: CabinForBookingSchema,
  guests: GuestBasicInfoSchema,
});

export type BookingWithRelations = Booking & {
  cabin: z.infer<typeof CabinForBookingSchema>;
  guest: z.infer<typeof GuestBasicInfoSchema>;
};
