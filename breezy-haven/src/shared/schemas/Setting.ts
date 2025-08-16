import { z } from 'zod';

export const SettingSchema = z.object({
  breakfastPrice: z.coerce.number({ error: 'breakfastPrice must be a number' }),
  created_at: z.string({ error: 'created_at must be a string' }),
  id: z.coerce.number({ error: 'id must be a number' }),
  maxBookingLength: z.coerce.number({
    error: 'maxBookingLength must be a number',
  }),
  maxGuestPerBooking: z.coerce.number({
    error: 'maxGuestPerBooking must be a number',
  }),
  minBookingLength: z.coerce.number({
    error: 'minBookingLength must be a number',
  }),
});
export const NullableSettingSchema = z.object({
  breakfastPrice: z.coerce
    .number({ error: 'breakfastPrice must be a number' })
    .nullable(),
  created_at: z.string({ error: 'created_at must be a string' }),
  id: z.coerce.number({ error: 'id must be a number' }),
  maxBookingLength: z.coerce
    .number({
      error: 'maxBookingLength must be a number',
    })
    .nullable(),
  maxGuestPerBooking: z.coerce
    .number({
      error: 'maxGuestPerBooking must be a number',
    })
    .nullable(),
  minBookingLength: z.coerce
    .number({
      error: 'minBookingLength must be a number',
    })
    .nullable(),
});

export type Setting = z.infer<typeof SettingSchema>;
export type NullableSetting = z.infer<typeof NullableSettingSchema>;
