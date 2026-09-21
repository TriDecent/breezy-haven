'use server';

import { Auth } from '@/features/auth';
import { bookingService } from '@/services';
import { ROUTES } from '@/shared/constants';
import {
  bookingArraySchema,
  BookingInputSchema,
  type Booking,
  type BookingActionResponse,
  type SafeBooking,
  type SafeBookingArray,
  type SafeBookingInput,
} from '@/shared/schemas';
import type { NonNullableObject } from '@/shared/types';
import { dateHelper } from '@/shared/utils';

import { revalidatePath } from 'next/cache';
import z from 'zod';

export async function updateBookingAction(
  _currentState: BookingActionResponse,
  formData: FormData
): Promise<BookingActionResponse> {
  const session = await Auth.guest.verifySession();
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

  const [validateDatesFailed] = await validateSelectedDates(
    parsedUpdateBookingInput,
    needsEditedBooking.cabinId
  );

  if (validateDatesFailed) return validateDatesFailed;

  const [updateBookingFailed] = await updateBooking(
    parsedUpdateBookingInput,
    needsEditedBooking.id,
    {
      numGuests: parsedUpdateBookingInput.guestCount,
      startDate: parsedUpdateBookingInput.startDate.toISOString(),
      endDate: parsedUpdateBookingInput.endDate.toISOString(),
      observations: parsedUpdateBookingInput.observations,
    }
  );

  if (updateBookingFailed) return updateBookingFailed;

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
    Awaited<ReturnType<typeof Auth.guest.getFullSessionAsync>>
  >
): Promise<
  | [success: SafeBookingArray, failed: null]
  | [success: null, failed: BookingActionResponse]
> {
  const { data: bookings, errors: bookingsError } =
    await bookingService.getByGuestId(session.main.id);

  if (bookingsError)
    return [
      null,
      {
        userEntered: input,
        errors: {
          unexpected:
            bookingsError.type === 'database'
              ? `${bookingsError.db.code}: ${bookingsError.db.message}`
              : bookingsError.message,
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

async function validateSelectedDates(
  input: SafeBookingInput,
  cabinId: number
): Promise<[failed: BookingActionResponse] | [failed: null]> {
  const { data: alreadyBookedDates, errors } =
    await bookingService.getBookedDatesByCabinId(cabinId);

  if (errors) {
    if (errors.type === 'database') {
      return [
        {
          userEntered: input,
          errors: {
            unexpected: errors.db.message,
          },
        },
      ];
    }

    return [
      {
        userEntered: input,
        errors: {
          unexpected: 'Unknown error',
        },
      },
    ];
  }

  const dateRange = { from: input.startDate, to: input.endDate };

  if (
    !dateHelper.isDateRangeValid(
      dateRange,
      dateHelper.excludeDatesInRange(alreadyBookedDates, dateRange)
    )
  )
    return [
      {
        userEntered: input,
        errors: {
          unexpected: 'These dates are unavailable as they are already booked.',
        },
      },
    ];

  return [null];
}

async function updateBooking(
  input: SafeBookingInput,
  needsUpdatedBookingId: number,
  updatedFields: Partial<Booking>
): Promise<[failed: BookingActionResponse] | [failed: null]> {
  const { errors } = await bookingService.update(
    needsUpdatedBookingId,
    updatedFields
  );

  if (errors?.type === 'database')
    return [
      {
        userEntered: input,
        errors: {
          unexpected: errors.db.message,
        },
      },
    ];

  if (errors?.type === 'validation') {
    const fieldErrors = errors.fields;
    return [
      {
        userEntered: input,
        errors: {
          ...fieldErrors,
          date: fieldErrors.startDate?.[0] ?? fieldErrors.endDate?.[0],
        },
      },
    ];
  }

  return [null];
}
