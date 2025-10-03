'use server';

import { Auth } from '@/features/auth';
import { fileService, staffCabinService } from '@/services';
import { ROUTES } from '@/shared/constants';
import type { Cabin } from '@/shared/schemas';

import { revalidatePath } from 'next/cache';

const bucketId = process.env.CABIN_IMAGE_BUCKET_ID!;

export async function deleteCabinAction(cabinId: Cabin['id']) {
  await Auth.staff.ensureStaffIsAuthenticatedAsync();

  const { data: needsDeletedCabin, errors: needsDeletedCabinError } =
    await staffCabinService.getById(cabinId);

  if (needsDeletedCabinError)
    throw createError(cabinId, needsDeletedCabinError.type);

  const deleteResult = await fileService.deleteAsync(
    [needsDeletedCabin.image.split('/').at(-1)!],
    bucketId
  );

  if (deleteResult.type === 'error')
    throw createError(cabinId, 'Image deletion failed');

  const { errors } = await staffCabinService.delete(cabinId);
  if (errors) throw createError(cabinId, errors.type);

  revalidatePath(ROUTES.cabins.href);
  revalidatePath(ROUTES.staff.nested.cabins.href);
  revalidatePath(`${ROUTES.cabins.href}/${cabinId}`);
}

function createError(cabinId: number, errorType: string) {
  return new Error(
    `An error has occurred while trying to delete cabin ${cabinId}. Error: ${errorType}`
  );
}
