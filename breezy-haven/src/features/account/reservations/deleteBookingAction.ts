'use server';
import { Auth } from '@/lib';
import { bookingService } from '@/services';
import { errorHelper, ROUTES } from '@/shared';
import { revalidatePath } from 'next/cache';

export async function deleteBooking(bookingId: number) {
  const session = await Auth.getFullSessionAsync();
  if (!session.main)
    throw new Error('You are not authorized to perform this action');

  const { data, errors } = await bookingService.getByGuestId(session.main.id);

  if (errors) throw errorHelper.handleError(errors);

  const requesterBookingIds = data.map(booking => booking.id);
  if (!requesterBookingIds.includes(bookingId))
    throw new Error("You don't have permission to delete this booking");

  await bookingService.delete(bookingId);
  revalidatePath(ROUTES.account.nested.profile.href);
}
