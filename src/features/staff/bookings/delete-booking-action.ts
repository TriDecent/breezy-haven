'use server';

import { Auth } from '@/features/auth';
import { staffBookingService } from '@/services';
import { ROUTES } from '@/shared/constants';
import type { Booking } from '@/shared/schemas';

import { revalidatePath } from 'next/cache';

export async function deleteBookingAction(
  bookingId: Booking['id']
): Promise<void> {
  await Auth.staff.ensureStaffIsAuthenticatedAsync();

  const { errors } = await staffBookingService.delete(bookingId);

  if (errors) throw new Error('Cannot delete the booking');

  revalidatePath(`${ROUTES.staff.nested.bookings.href}/${bookingId}`);
}
