'use server';
import { Auth } from '@/lib';
import { bookingService } from '@/services';
import { ROUTES } from '@/shared';
import { revalidatePath } from 'next/cache';

export async function deleteBooking(bookingId: number) {
  const session = await Auth.getFullSessionAsync();
  if (!session.main)
    throw new Error('You are not authorized to perform this action');

  const { data } = await bookingService.getByGuestId(session.main.id);

  const requesterBookingIds = data.map(booking => booking.id);
  if (!requesterBookingIds.includes(bookingId))
    throw new Error("You don't have permission to delete this booking");

  await bookingService.delete(bookingId);
  revalidatePath(ROUTES.account.nested.profile.href);
}
