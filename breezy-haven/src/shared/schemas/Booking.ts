import { isValid, parseISO } from 'date-fns';
import z from 'zod';

const cabinSchema = z.object({
  name: z.string(),
  image: z.string(),
  maxCapacity: z.coerce.number(),
});

export const GetByGuestIdBookingSchema = z.object({
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

export const BookingInputSchema = z.object({
  bookingId: z.coerce.number({ error: 'Your booking id must be a number' }),
  guestCount: z.coerce.number({
    error: 'Number of guests staying must be a number',
  }),
  startDate: z
    .string()
    .transform(value => parseISO(value))
    .refine(isValid, {
      error: 'Invalid date format',
    }),
  endDate: z
    .string()
    .transform(value => parseISO(value))
    .refine(isValid, {
      error: 'Invalid date format',
    }),
  observations: z
    .string()
    .trim()
    .refine(
      value => value === '' || (value.length >= 10 && value.length <= 300),
      {
        message: 'Must be empty or between 10 and 300 characters',
      }
    )
    .optional(),
});

export type SafeBookingInput = z.infer<typeof BookingInputSchema>;
export type BookingActionResponse = {
  errors: Partial<
    Omit<Record<keyof SafeBookingInput, string[]>, 'startDate' | 'endDate'> & {
      date: string;
      unexpected: string;
    }
  > | null;
  userEntered: Partial<SafeBookingInput> | null;
  isActionSuccess?: boolean;
};

export const bookingArraySchema = z.array(GetByGuestIdBookingSchema);
export type SafeBooking = z.infer<typeof GetByGuestIdBookingSchema>;
export type SafeBookingArray = z.infer<typeof bookingArraySchema>;
