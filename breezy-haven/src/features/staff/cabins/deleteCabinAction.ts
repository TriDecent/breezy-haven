'use server';

import { staffCabinService } from '@/services';
import { ROUTES, type Cabin } from '@/shared';
import { revalidatePath } from 'next/cache';

export async function deleteCabinAction(cabinId: Cabin['id']) {
  // TODO: verify staff authentication
  const { errors } = await staffCabinService.delete(cabinId);
  if (errors)
    throw Error(
      `An error has occurred while trying to delete cabin ${cabinId}. Error: ${errors.type}`
    );

  revalidatePath(ROUTES.cabins.href);
  revalidatePath(ROUTES.staff.nested.cabins.href);
  revalidatePath(`${ROUTES.cabins.href}/${cabinId}`);
}
