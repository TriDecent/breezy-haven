'use server';

import { staffBookingService } from '@/services';
import { ROUTES, type Booking } from '@/shared';
import { revalidatePath } from 'next/cache';

export async function updateCheckinAsync(bookingId: Booking['id']) {
  await new Promise(resolve => setTimeout(resolve, 3000));

  const { data, errors } = await staffBookingService.getById(bookingId);

  if (errors) throw new Error('Could not find the updated booking');

  if (data.status !== 'unconfirmed')
    throw new Error(
      'The booking has already been checked in and cannot be checked in again'
    );

  const { errors: updatedErrors } = await staffBookingService.update(
    bookingId,
    { status: 'checked-in' }
  );

  if (updatedErrors)
    throw new Error(
      'An error has occurred while trying to check in the booking'
    );

  revalidatePath(`${ROUTES.staff.nested.bookings.href}/${bookingId}`);
}
