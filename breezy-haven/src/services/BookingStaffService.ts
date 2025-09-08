import { type DTOBooking, type DTOSetting } from '@/repositories';
import {
  BookingSchema,
  CabinSchema,
  GuestSchema,
  type Booking,
  type NullableBooking,
} from '@/shared';
import { PostgrestError } from '@supabase/supabase-js';
import { cache } from 'react';

import { supabase } from '@/lib';
import type z from 'zod';
import type { IStaffService } from './BaseStaffService';
import type { GetAllServiceReturnType, ServiceReturnType } from './types';

const CabinForBookingSchema = CabinSchema.pick({
  id: true,
  name: true,
  image: true,
});
const GuestBasicInfoSchema = GuestSchema.pick({
  fullName: true,
  email: true,
});

const BookingWithRelationsSchema = BookingSchema.extend({
  cabins: CabinForBookingSchema,
  guests: GuestBasicInfoSchema,
});

type BookingWithRelations = Booking & {
  cabin: z.infer<typeof CabinForBookingSchema>;
  guest: z.infer<typeof GuestBasicInfoSchema>;
};

export default class BookingStaffService<T extends Booking | NullableBooking>
  implements IStaffService<DTOBooking, T>
{
  constructor(private readonly _service: IStaffService<DTOBooking, T>) {
    this.getAll = cache(this.getAll.bind(this));
    this.getById = cache(this.getById.bind(this));
  }
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
  create(item: Partial<DTOSetting>) {
    return this._service.create(item);
  }
  update(id: number, updatedFields: Partial<DTOBooking>) {
    return this._service.update(id, updatedFields);
  }
  delete(id: number) {
    return this._service.delete(id);
  }
  async uploadFile(
    file: File,
    path: string,
    bucketId: string
  ): ServiceReturnType<{ id: string; path: string; fullPath: string }, Error> {
    return this._service.uploadFile(file, path, bucketId);
  }

  async deleteFiles(
    paths: readonly string[],
    bucketId: string
  ): ServiceReturnType<null, Error> {
    return this._service.deleteFiles(paths, bucketId);
  }

  async getAllBookingsWithRelations(): Promise<
    GetAllServiceReturnType<BookingWithRelations>
  > {
    await this._service.verifyPermission();

    const query = supabase.from('bookings').select(
      `
        *,
        cabins(id, name, image),
        guests(fullName, email)
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

  private validateItems<T>(items: unknown[], schema: z.ZodType<T>): T[] {
    const validItems: T[] = [];

    for (const item of items) {
      const parsedResult = schema.safeParse(item);
      if (!parsedResult.success) continue;

      validItems.push(parsedResult.data);
    }

    return validItems;
  }
}
