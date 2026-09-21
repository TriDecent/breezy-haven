import z from 'zod';

export const BookingQueries = [
  'all',
  'checked-in',
  'checked-out',
  'unconfirmed',
  'today-checkin',
  'today-checkout'
] as const;

export const BookingQuerySchema = z.object({
  query: z.literal(BookingQueries),
});

export type BookingQuery = z.infer<typeof BookingQuerySchema>;
