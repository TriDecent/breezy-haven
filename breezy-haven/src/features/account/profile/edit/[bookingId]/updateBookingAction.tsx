'use server';

import { Auth } from '@/lib';
import { bookingSchema, bookingService } from '@/services';
import { ROUTES } from '@/shared';
import { isValid, parseISO } from 'date-fns';
import { revalidatePath } from 'next/cache';
import z from 'zod';

const updateBookingSchema = z.object({
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
  observations: z.string().optional(),
});

type SafeUpdateBooking = z.infer<typeof updateBookingSchema>;
export type UpdateBookingResponse = {
  errors: Partial<
    Omit<Record<keyof SafeUpdateBooking, string[]>, 'startDate' | 'endDate'> & {
      date: string;
      unexpected: string;
    }
  > | null;
  userEntered: Partial<SafeUpdateBooking> | null;
  isActionSuccess?: boolean;
};

const bookingArraySchema = z.array(bookingSchema);

export async function updateBookingAction(
  _currentState: UpdateBookingResponse,
  formData: FormData
): Promise<UpdateBookingResponse> {
  const session = await Auth.verifySession();
  const input = Object.fromEntries(formData.entries());

  const parsedUpdateBookingInput = updateBookingSchema.safeParse(input);

  if (!parsedUpdateBookingInput.success) {
    const errors = z.flattenError(parsedUpdateBookingInput.error).fieldErrors;

    return {
      userEntered: input,
      errors: {
        ...errors,
        date: errors?.startDate?.[0] ?? errors.endDate?.[0],
      },
    };
  }

  const { data: bookings, error: bookingsError } =
    await bookingService.getByGuestId(session.main.id);

  if (bookingsError)
    return {
      userEntered: input,
      errors: {
        unexpected: `${bookingsError.code}: ${bookingsError.message}`,
      },
    };

  const parsedBookingsData = bookingArraySchema.safeParse(bookings);

  if (!parsedBookingsData.success)
    return {
      userEntered: input,
      errors: {
        unexpected: `Something is wrong with your editing! ${parsedBookingsData.error.issues[0]}`,
      },
    };

  const needsEditedBooking = parsedBookingsData.data.find(
    booking => booking.id === parsedUpdateBookingInput.data.bookingId
  );

  if (!needsEditedBooking)
    return {
      userEntered: input,
      errors: {
        unexpected: 'You do not have permission to edit this booking!',
      },
    };

  const { error } = await bookingService.update(needsEditedBooking.id, {
    startDate: parsedUpdateBookingInput.data.startDate.toISOString(),
    endDate: parsedUpdateBookingInput.data.endDate.toISOString(),
    observations: parsedUpdateBookingInput.data.observations,
  });
  if (error)
    return {
      userEntered: input,
      errors: {
        unexpected: error.message,
      },
    };

  revalidatePath(
    `${ROUTES.account.nested.reservations.nested.edit.href}/${needsEditedBooking.id}`
  );

  return {
    errors: null,
    userEntered: null,
    isActionSuccess: true,
  };
}
