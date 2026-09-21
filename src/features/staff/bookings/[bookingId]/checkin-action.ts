'use server';

import { Auth } from '@/features/auth';
import { staffBookingService, staffSettingService } from '@/services';
import { ROUTES } from '@/shared/constants';
import type { Booking } from '@/shared/schemas';

import { revalidatePath } from 'next/cache';

export async function checkinAction(
  bookingId: Booking['id'],
  hasBreakfast: boolean
): Promise<void> {
  await Auth.staff.ensureStaffIsAuthenticatedAsync();

  const { data: booking, errors: bookingErrors } =
    await staffBookingService.getById(bookingId);
  if (bookingErrors) throw new Error('Could not find the updated booking');
  const { data: setting, errors: settingErrors } =
    await staffSettingService.getAll();

  if (settingErrors) throw new Error('Something is wrong with setting service');
  const currentSetting = setting[0];

  if (booking.status !== 'unconfirmed')
    throw new Error(
      'The booking has already been checked in and cannot be checked in again'
    );

  const { errors: updatedErrors } = await staffBookingService.update(
    bookingId,
    {
      status: 'checked-in',
      isPaid: true,
      hasBreakfast,
      totalPrice: hasBreakfast
        ? booking.totalPrice + booking.numNights * currentSetting.breakfastPrice
        : booking.totalPrice,
      extrasPrice: booking.numNights * currentSetting.breakfastPrice,
    }
  );

  if (updatedErrors)
    throw new Error(
      'An error has occurred while trying to check in the booking'
    );

  revalidatePath(`${ROUTES.staff.nested.bookings.href}/${bookingId}`);
}
