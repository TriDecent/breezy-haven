'use server';

import { Auth } from '@/lib';
import type { NonNullableObject } from '@/repositories';
import { bookingService } from '@/services';
import {
  bookingArraySchema,
  BookingInputSchema,
  ROUTES,
  type BookingActionResponse,
  type SafeBooking,
  type SafeBookingArray,
  type SafeBookingInput,
} from '@/shared';
import { revalidatePath } from 'next/cache';
import z from 'zod';

export async function updateBookingAction(
  _currentState: BookingActionResponse,
  formData: FormData
): Promise<BookingActionResponse> {
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
  | [success: SafeBookingInput, failed: null]
  | [success: null, failed: BookingActionResponse] {
  const parsedUpdateBookingInput = BookingInputSchema.safeParse(input);

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
  input: SafeBookingInput,
  session: NonNullableObject<
    Awaited<ReturnType<typeof Auth.getFullSessionAsync>>
  >
): Promise<
  | [success: SafeBookingArray, failed: null]
  | [success: null, failed: BookingActionResponse]
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
  input: SafeBookingInput,
  bookings: SafeBookingArray
):
  | [success: SafeBooking, failed: null]
  | [success: null, failed: BookingActionResponse] {
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
