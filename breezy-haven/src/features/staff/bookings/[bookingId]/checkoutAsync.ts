'use server';
import { staffBookingService } from '@/services';
import { ROUTES, type Booking } from '@/shared';
import { revalidatePath } from 'next/cache';

export async function checkoutAsync(bookingId: Booking['id']) {
  // TODO: verify staff authentication

  const { errors } = await staffBookingService.update(bookingId, {
    status: 'checked-out',
  });

  if (errors)
    throw new Error(
      'An error has occurred while trying to check out the booking'
    );

  revalidatePath(`${ROUTES.staff.nested.bookings.href}/${bookingId}`);
}
