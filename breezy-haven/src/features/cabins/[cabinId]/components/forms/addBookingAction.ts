'use server';

import { Auth } from '@/lib';
import { bookingService, cabinService } from '@/services';
import { dateHelper, ROUTES } from '@/shared';
import { differenceInDays, isValid, parseISO } from 'date-fns';
import { revalidatePath } from 'next/cache';
import z from 'zod';

const SafeInputSchema = z.object({
  cabinId: z.coerce.number({ error: 'Cabin ID must be a number' }),
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

type SafeInput = z.infer<typeof SafeInputSchema>;

export type AddBookingResponse = {
  isSuccess?: boolean;
  userEntered: Partial<SafeInput> | null;
  errors: Partial<
    Record<keyof Omit<SafeInput, 'guestId'>, string[]> & { unexpected: string }
  > | null;
};

export async function addBookingAction(
  _currentState: AddBookingResponse,
  formData: FormData
): Promise<AddBookingResponse> {
  const { id: guestId } = (await Auth.verifySession()).main;
  const input = Object.fromEntries(formData.entries());

  const parsedInput = SafeInputSchema.safeParse(input);

  if (!parsedInput.success) {
    const errors = z.flattenError(parsedInput.error).fieldErrors;

    return {
      userEntered: input,
      errors,
    };
  }

  const { data: cabin, errors: cabinErrors } = await cabinService.getById(
    parsedInput.data.cabinId
  );

  if (cabinErrors) {
    if (cabinErrors.type === 'database') {
      return {
        userEntered: input,
        errors: {
          unexpected: cabinErrors.db.message,
        },
      };
    }
    if (cabinErrors.type === 'validation') {
      return {
        userEntered: input,
        errors: {
          unexpected: 'Cannot retrieve booked cabin info.',
        },
      };
    }

    return {
      userEntered: input,
      errors: {
        unexpected: 'Unknown error',
      },
    };
  }

  if (
    cabin.maxCapacity < parsedInput.data.guestCount ||
    parsedInput.data.guestCount < 1
  ) {
    return {
      userEntered: input,
      errors: {
        guestCount: [
          'The number of guests exceeded the maximum capacity of this cabin',
        ],
      },
    };
  }

  const { data: alreadyBookedDates, errors } =
    await bookingService.getBookedDatesByCabinId(cabin.id);

  if (errors) {
    if (errors.type === 'database') {
      return {
        userEntered: input,
        errors: {
          unexpected: errors.db.message,
        },
      };
    }

    return {
      userEntered: input,
      errors: {
        unexpected: 'Unknown error',
      },
    };
  }

  if (
    !dateHelper.isDateRangeValid(
      { from: parsedInput.data.startDate, to: parsedInput.data.endDate },
      alreadyBookedDates
    )
  )
    return {
      userEntered: input,
      errors: {
        unexpected: 'These dates are unavailable as they are already booked.',
      },
    };

  const nightsCount = Math.abs(
    differenceInDays(parsedInput.data.startDate, parsedInput.data.endDate)
  );
  const totalPrice = nightsCount * (cabin.regularPrice - cabin.discount);

  const { errors: bookingErrors } = await bookingService.create({
    guestId,
    cabinId: cabin.id,
    totalPrice,
    cabinPrice: cabin.regularPrice,
    startDate: parsedInput.data.startDate.toISOString(),
    endDate: parsedInput.data.endDate.toISOString(),
    numGuests: parsedInput.data.guestCount,
    numNights: nightsCount,
    observations: parsedInput.data.observations,

    extrasPrice: 0, // * CHANGE THIS
    hasBreakfast: false, // * CHANGE THIS
    isPaid: false, // * CHANGE THIS
    status: 'unconfirmed', // * CHANGE THIS
  });

  if (bookingErrors) {
    return {
      userEntered: input,
      errors: {
        unexpected:
          'Something is wrong with booking process, please try again.',
      },
    };
  }

  revalidatePath(`${ROUTES.cabins.href}/${cabin.id}`); // ISR Route, must call this instead of using router.refresh

  return {
    isSuccess: true,
    userEntered: null,
    errors: null,
  };
}
