import { z } from 'zod';
export const DefaultSettingSchema = z.object({
  breakfastPrice: z.number(),
  created_at: z.string(),
  id: z.number(),
  maxBookingLength: z.number(),
  maxGuestPerBooking: z.number(),
  minBookingLength: z.number(),
});
