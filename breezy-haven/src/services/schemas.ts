import z from 'zod';

const cabinSchema = z.object({
  name: z.string(),
  image: z.string(),
  maxCapacity: z.coerce.number(),
});

export const bookingSchema = z.object({
  cabin: cabinSchema,
  cabinId: z.number(),
  cabinPrice: z.number(),
  created_at: z.string(),
  endDate: z.string(),
  extrasPrice: z.number(),
  guestId: z.number(),
  hasBreakfast: z.boolean(),
  id: z.number(),
  isPaid: z.boolean(),
  numGuests: z.number(),
  numNights: z.number(),
  observations: z.string(),
  startDate: z.string(),
  status: z.string(),
  totalPrice: z.number(),
});
