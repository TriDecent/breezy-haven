'use server';

import { staffBookingService } from '@/services';
import { ROUTES, type Booking } from '@/shared';
import { revalidatePath } from 'next/cache';

export async function deleteBookingAction(
  bookingId: Booking['id']
): Promise<void> {
  // TODO: verify staff authentication
  const { errors } = await staffBookingService.delete(bookingId);

  if (errors) throw new Error('Cannot delete the booking');

  revalidatePath(`${ROUTES.staff.nested.bookings.href}/${bookingId}`);
}
