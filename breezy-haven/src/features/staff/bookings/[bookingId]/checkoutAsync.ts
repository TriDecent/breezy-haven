'use server';
import { Auth } from '@/lib';
import { staffBookingService } from '@/services';
import { ROUTES } from '@/shared/constants';
import type { Booking } from '@/shared/schemas';

import { revalidatePath } from 'next/cache';

export async function checkoutAsync(bookingId: Booking['id']) {
  await Auth.staff.ensureStaffIsAuthenticatedAsync();

  const { errors } = await staffBookingService.update(bookingId, {
    status: 'checked-out',
  });

  if (errors)
    throw new Error(
      'An error has occurred while trying to check out the booking'
    );

  revalidatePath(`${ROUTES.staff.nested.bookings.href}/${bookingId}`);
}
