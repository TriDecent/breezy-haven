import { isValid, parseISO } from 'date-fns';
import z from 'zod';

export const BookingSchema = z.object({
  cabinId: z.coerce.number({ error: 'cabinId must be a number' }),
  cabinPrice: z.coerce.number({ error: 'cabinPrice must be a number' }),
  created_at: z.string({ error: 'created_at must be a string' }),
  endDate: z.string({ error: 'endDate must be a string' }),
  extrasPrice: z.coerce.number({ error: 'extrasPrice must be a number' }),
  guestId: z.coerce.number({ error: 'guestId must be a number' }),
  hasBreakfast: z.boolean({ error: 'hasBreakfast must be a boolean' }),
  id: z.coerce.number({ error: 'id must be a number' }),
  isPaid: z.boolean({ error: 'isPaid must be a boolean' }),
  numGuests: z.coerce.number({ error: 'numGuests must be a number' }),
  numNights: z.coerce.number({ error: 'numNights must be a number' }),
  observations: z.string({ error: 'observations must be a string' }),
  startDate: z.string({ error: 'startDate must be a string' }),
  status: z.literal(['unconfirmed', 'checked-out', 'checked-in'], {
    error: 'Status is invalid',
  }),
  totalPrice: z.coerce.number({ error: 'totalPrice must be a number' }),
});
export const NullableBookingSchema = z.object({
  cabinId: z.coerce.number({ error: 'cabinId must be a number' }).nullable(),
  cabinPrice: z.coerce
    .number({ error: 'cabinPrice must be a number' })
    .nullable(),
  created_at: z.string({ error: 'created_at must be a string' }),
  endDate: z.string({ error: 'endDate must be a string' }).nullable(),
  extrasPrice: z.coerce
    .number({ error: 'extrasPrice must be a number' })
    .nullable(),
  guestId: z.coerce.number({ error: 'guestId must be a number' }).nullable(),
  hasBreakfast: z
    .boolean({ error: 'hasBreakfast must be a boolean' })
    .nullable(),
  id: z.coerce.number({ error: 'id must be a number' }),
  isPaid: z.boolean({ error: 'isPaid must be a boolean' }).nullable(),
  numGuests: z.coerce
    .number({ error: 'numGuests must be a number' })
    .nullable(),
  numNights: z.coerce
    .number({ error: 'numNights must be a number' })
    .nullable(),
  observations: z.string({ error: 'observations must be a string' }).nullable(),
  startDate: z.string({ error: 'startDate must be a string' }).nullable(),
  status: z
    .literal(['unconfirmed', 'checked-out', 'checked-in'], {
      error: 'Status is invalid',
    })
    .nullable(),
  totalPrice: z.coerce
    .number({ error: 'totalPrice must be a number' })
    .nullable(),
});
export type Booking = z.infer<typeof BookingSchema>;
export type NullableBooking = z.infer<typeof NullableBookingSchema>;

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
