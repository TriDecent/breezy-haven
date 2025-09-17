'use server';
import { Auth } from '@/lib';
import { bookingService } from '@/services';
import { ROUTES } from '@/shared/constants';
import { errorHelper } from '@/shared/utils';

import { revalidatePath } from 'next/cache';

export async function deleteBooking(bookingId: number) {
  const session = await Auth.guest.getFullSessionAsync();
  if (!session.main)
    throw new Error('You are not authorized to perform this action');

  const { data, errors } = await bookingService.getByGuestId(session.main.id);

  if (errors) throw errorHelper.handleError(errors);

  const needsDeletedBooking = data.find(booking => booking.id === bookingId);
  if (!needsDeletedBooking)
    throw new Error("You don't have permission to delete this booking");

  await bookingService.delete(bookingId);
  revalidatePath(ROUTES.account.nested.profile.href);
  revalidatePath(`${ROUTES.cabins.href}/${needsDeletedBooking.cabinId}`);
}
