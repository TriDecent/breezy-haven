import z from 'zod';

export const bookingTimeFrames = [7, 30, 90];
export const BookingQuerySchema = z.object({
  last: z.coerce.number().refine(num => bookingTimeFrames.includes(num)),
});
export type BookingQuery = z.infer<typeof BookingQuerySchema>['last'];
