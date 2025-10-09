'use server';

import { Auth } from '@/features/auth';
import { staffBookingService, unauthCabinService } from '@/services';
import type { ActionResponse } from '@/shared/actions';
import { BookingSchema, type Booking, type Cabin } from '@/shared/schemas';
import type { Result } from '@/shared/types';
import { dateHelper } from '@/shared/utils';

import { differenceInDays, isValid, parseISO } from 'date-fns';
import z from 'zod';

const SafeInputSchema = BookingSchema.omit({
  created_at: true,
  id: true,
  startDate: true,
  endDate: true,
  hasBreakfast: true,
  cabinPrice: true,
  extrasPrice: true,
  isPaid: true,
  numNights: true,
  totalPrice: true,
  status: true,
}).extend({
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
  hasBreakfast: z.coerce.boolean({
    error: 'Did not specify whether to include breakfast or not',
  }),
});

type SafeInput = z.infer<typeof SafeInputSchema>;

export type AddBookingResponse =
  ActionResponse<
    Partial<SafeInput>,
    Partial<Record<keyof SafeInput, string[]> & { unexpected: string }>
  > extends infer U
    ? U extends { type: 'success' }
      ? U & { payload: { createdBookingId: Booking['id'] } }
      : U
    : never;

export async function addBookingAction(
  _currentState: AddBookingResponse,
  formData: FormData
): Promise<AddBookingResponse> {
  await Auth.staff.ensureStaffIsAuthenticatedAsync();
  const input = Object.fromEntries(formData.entries());
  const parsedResult = validateInput(input);
  if (parsedResult.type === 'error') return parsedResult.payload;

  const newBooking = parsedResult.payload;

  const validatedBookingInputResult = await validateBookingAsync(newBooking);

  if (validatedBookingInputResult.type === 'error')
    return validatedBookingInputResult.payload;

  const { validatedBooking, bookedCabin } = validatedBookingInputResult.payload;

  const nightsCount = Math.abs(
    differenceInDays(validatedBooking.startDate, validatedBooking.endDate)
  );

  const totalPrice =
    nightsCount * (bookedCabin.regularPrice - bookedCabin.discount);

  const { data: createdBooking, errors: bookingErrors } =
    await staffBookingService.create({
      guestId: validatedBooking.guestId,
      cabinId: bookedCabin.id,
      totalPrice,
      cabinPrice: bookedCabin.regularPrice,
      startDate: dateHelper.toISODateOnly(validatedBooking.startDate),
      endDate: dateHelper.toISODateOnly(validatedBooking.endDate),
      numGuests: validatedBooking.numGuests,
      numNights: nightsCount,
      observations: validatedBooking.observations,
      hasBreakfast: validatedBooking.hasBreakfast,

      extrasPrice: 0,
      isPaid: false,
      status: 'unconfirmed',
    });

  if (bookingErrors)
    return {
      type: 'error',
      payload: {
        userEntered: validatedBooking,
        errors: {
          unexpected:
            'Something is wrong with booking process, please try again.',
        },
        isSuccess: false,
      },
    };

  return {
    type: 'success',
    payload: {
      isSuccess: true,
      userEntered: null,
      errors: null,
      createdBookingId: createdBooking.id,
    },
  };
}

function validateInput(
  input: Record<string, unknown>
): Result<SafeInput, AddBookingResponse> {
  const parsedResult = SafeInputSchema.safeParse(input);

  if (!parsedResult.success)
    return {
      type: 'error',
      payload: {
        type: 'error',
        payload: {
          userEntered: input,
          errors: z.flattenError(parsedResult.error).fieldErrors,
          isSuccess: false,
        },
      },
    };

  return {
    type: 'success',
    payload: parsedResult.data,
  };
}

async function validateBookingAsync(
  booking: SafeInput
): Promise<
  Result<
    { validatedBooking: SafeInput; bookedCabin: Cabin },
    AddBookingResponse
  >
> {
  const { data: cabin, errors: cabinErrors } = await unauthCabinService.getById(
    booking.cabinId
  );

  if (cabinErrors)
    return {
      type: 'error',
      payload: {
        type: 'error',
        payload: {
          userEntered: booking,
          errors: {
            unexpected: 'An error has occurred while trying to retrieve cabin',
          },
          isSuccess: false,
        },
      },
    };

  if (booking.numGuests < 1 || cabin.maxCapacity < booking.numGuests)
    return {
      type: 'error',
      payload: {
        type: 'error',
        payload: {
          userEntered: booking,
          errors: {
            numGuests: [
              'The number of guests exceeded the maximum capacity of this cabin',
            ],
          },
          isSuccess: false,
        },
      },
    };

  const { data: alreadyBookedDates, errors: bookedDatesErrors } =
    await staffBookingService.getBookedDatesByCabinId(cabin.id);

  if (bookedDatesErrors)
    return {
      type: 'error',
      payload: {
        type: 'error',
        payload: {
          userEntered: booking,
          errors: {
            unexpected:
              'An error has occurred while trying to retrieve booked date of the current cabin',
          },
          isSuccess: false,
        },
      },
    };

  if (
    !dateHelper.isDateRangeValid(
      { from: booking.startDate, to: booking.endDate },
      alreadyBookedDates
    )
  )
    return {
      type: 'error',
      payload: {
        type: 'error',
        payload: {
          userEntered: booking,
          errors: {
            unexpected:
              'These dates are unavailable as they are already booked.',
          },
          isSuccess: false,
        },
      },
    };

  return {
    type: 'success',
    payload: { validatedBooking: booking, bookedCabin: cabin },
  };
}
