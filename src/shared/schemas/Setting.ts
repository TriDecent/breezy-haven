import { z } from 'zod';

export const SettingSchema = z
  .object({
    breakfastPrice: z.coerce
      .number({ error: 'breakfastPrice must be a number' })
      .positive({ error: 'breakfastPrice must be a positive number' }),
    created_at: z.string({ error: 'created_at must be a string' }),
    id: z.coerce.number({ error: 'id must be a number' }),
    maxBookingLength: z.coerce
      .number({
        error: 'maxBookingLength must be a number',
      })
      .positive({ error: 'maxBookingLength must be a positive number' }),
    maxGuestPerBooking: z.coerce
      .number({
        error: 'maxGuestPerBooking must be a number',
      })
      .positive({ error: 'maxGuestPerBooking must be a positive number' }),
    minBookingLength: z.coerce
      .number({
        error: 'minBookingLength must be a number',
      })
      .positive({ error: 'minBookingLength must be a positive number' }),
  })
  .refine(data => data.minBookingLength < data.maxBookingLength, {
    error: 'minBookingLength must be less than maxBookingLength',
    path: ['maxBookingLength'],
  })
  .refine(data => data.minBookingLength < data.maxBookingLength, {
    error: 'minBookingLength must be less than maxBookingLength',
    path: ['minBookingLength'],
  });

export const NullableSettingSchema = z
  .object({
    breakfastPrice: z.coerce
      .number({ error: 'breakfastPrice must be a number' })
      .positive({ error: 'breakfastPrice must be a positive number' })
      .nullable(),
    created_at: z.string({ error: 'created_at must be a string' }),
    id: z.coerce.number({ error: 'id must be a number' }),
    maxBookingLength: z.coerce
      .number({
        error: 'maxBookingLength must be a number',
      })
      .positive({ error: 'maxBookingLength must be a positive number' })
      .nullable(),
    maxGuestPerBooking: z.coerce
      .number({
        error: 'maxGuestPerBooking must be a number',
      })
      .positive({ error: 'maxGuestPerBooking must be a positive number' })
      .nullable(),
    minBookingLength: z.coerce
      .number({
        error: 'minBookingLength must be a number',
      })
      .positive({ error: 'minBookingLength must be a positive number' })
      .nullable(),
  })
  .refine(
    data =>
      data.minBookingLength !== null &&
      data.maxBookingLength !== null &&
      data.minBookingLength < data.maxBookingLength,
    {
      error:
        'minBookingLength must be less than maxBookingLength when both are provided',
      path: ['maxBookingLength'],
    }
  )
  .refine(
    data =>
      data.minBookingLength !== null &&
      data.maxBookingLength !== null &&
      data.minBookingLength < data.maxBookingLength,
    {
      error:
        'minBookingLength must be less than maxBookingLength when both are provided',
      path: ['minBookingLength'],
    }
  );

export type Setting = z.infer<typeof SettingSchema>;
export type NullableSetting = z.infer<typeof NullableSettingSchema>;
