'use server';

import { Auth } from '@/lib';
import type { NonNullableObject } from '@/repositories';
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

type SafeUpdateBookingInput = z.infer<typeof updateBookingSchema>;
export type UpdateBookingResponse = {
  errors: Partial<
    Omit<
      Record<keyof SafeUpdateBookingInput, string[]>,
      'startDate' | 'endDate'
    > & {
      date: string;
      unexpected: string;
    }
  > | null;
  userEntered: Partial<SafeUpdateBookingInput> | null;
  isActionSuccess?: boolean;
};

const bookingArraySchema = z.array(bookingSchema);
type SafeBooking = z.infer<typeof bookingSchema>;
type SafeBookingArray = z.infer<typeof bookingArraySchema>;

export async function updateBookingAction(
  _currentState: UpdateBookingResponse,
  formData: FormData
): Promise<UpdateBookingResponse> {
  const session = await Auth.verifySession();
  const input = Object.fromEntries(formData.entries());

  const [parsedUpdateBookingInput, failedInput] = validateInput(input);

  if (!parsedUpdateBookingInput) return failedInput;

  const [parsedBookingsData, failedData] = await validateBookingsFromDB(
    parsedUpdateBookingInput,
    session
  );

  if (!parsedBookingsData) return failedData;

  const [needsEditedBooking, failedAuthorization] = authorizePermission(
    parsedUpdateBookingInput,
    parsedBookingsData
  );

  if (!needsEditedBooking) return failedAuthorization;

  const { error } = await bookingService.update(needsEditedBooking.id, {
    numGuests: parsedUpdateBookingInput.guestCount,
    startDate: parsedUpdateBookingInput.startDate.toISOString(),
    endDate: parsedUpdateBookingInput.endDate.toISOString(),
    observations: parsedUpdateBookingInput.observations,
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

function validateInput(
  input: Record<string, string | File>
):
  | [success: SafeUpdateBookingInput, failed: null]
  | [success: null, failed: UpdateBookingResponse] {
  const parsedUpdateBookingInput = updateBookingSchema.safeParse(input);

  if (!parsedUpdateBookingInput.success) {
    const errors = z.flattenError(parsedUpdateBookingInput.error).fieldErrors;

    return [
      null,
      {
        userEntered: input,
        errors: {
          ...errors,
          date: errors?.startDate?.[0] ?? errors.endDate?.[0],
        },
      },
    ];
  }

  return [parsedUpdateBookingInput.data, null];
}

async function validateBookingsFromDB(
  input: SafeUpdateBookingInput,
  session: NonNullableObject<
    Awaited<ReturnType<typeof Auth.getFullSessionAsync>>
  >
): Promise<
  | [success: SafeBookingArray, failed: null]
  | [success: null, failed: UpdateBookingResponse]
> {
  const { data: bookings, error: bookingsError } =
    await bookingService.getByGuestId(session.main.id);

  if (bookingsError)
    return [
      null,
      {
        userEntered: input,
        errors: {
          unexpected: `${bookingsError.code}: ${bookingsError.message}`,
        },
      },
    ];

  const parsedBookingsData = bookingArraySchema.safeParse(bookings);

  if (!parsedBookingsData.success)
    return [
      null,
      {
        userEntered: input,
        errors: {
          unexpected: `Something is wrong with your editing! ${parsedBookingsData.error.issues[0]}`,
        },
      },
    ];

  return [parsedBookingsData.data, null];
}

function authorizePermission(
  input: SafeUpdateBookingInput,
  bookings: SafeBookingArray
):
  | [success: SafeBooking, failed: null]
  | [success: null, failed: UpdateBookingResponse] {
  const needsEditedBooking = bookings.find(
    booking => booking.id === input.bookingId
  );

  if (!needsEditedBooking)
    return [
      null,
      {
        userEntered: input,
        errors: {
          unexpected: 'You do not have permission to edit this booking!',
        },
      },
    ];

  return [needsEditedBooking, null];
}
