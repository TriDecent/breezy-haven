'use server';
import { staffCabinService } from '@/services';
import { ROUTES, type Cabin } from '@/shared';
import { revalidatePath } from 'next/cache';
import path from 'path';
import z from 'zod';
import { AddCabinSchema, type ActionResponse } from './types';

export async function addCabinAction(
  _currentState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  // TODO: verify staff authentication
  const input = Object.fromEntries(formData.entries());

  const parsedInput = AddCabinSchema.safeParse(input);

  if (!parsedInput.success) {
    const errors = z.flattenError(parsedInput.error).fieldErrors;

    return {
      userEntered: input,
      error: errors,
    };
  }

  const userEnteredWithoutImage = { ...input };

  const fileName = `${crypto.randomUUID()}-${parsedInput.data.image.name}`;
  const [uploadResult] = await uploadImageAsync(
    fileName,
    parsedInput.data.image
  );
  if (!uploadResult)
    return {
      userEntered: userEnteredWithoutImage,
      error: {
        image: ['Upload image failed!.'],
      },
    };

  const doesCreateCabinSuccess = await createCabinAsync({
    ...parsedInput.data,
    image: path.posix.join(
      process.env.SUPABASE_BUCKET ?? '',
      uploadResult.fullPath
    ),
  });

  if (!doesCreateCabinSuccess)
    return {
      userEntered: userEnteredWithoutImage,
      error: {
        unexpected:
          'An error occurred while trying to add a new a cabin. Please try again!',
      },
    };

  revalidatePath(ROUTES.staff.nested.cabins.href);

  return {
    userEntered: null,
    error: null,
    success: true,
  };
}

async function uploadImageAsync(
  path: string,
  image: File
): Promise<
  [success: { id: string; path: string; fullPath: string }] | [success: null]
> {
  const { data, errors } = await staffCabinService.uploadFile(
    image,
    path,
    'cabin-images'
  );

  if (errors) return [null];

  return [data];
}

async function createCabinAsync(
  cabin: Omit<Cabin, 'id' | 'created_at'>
): Promise<[success: boolean]> {
  const { errors } = await staffCabinService.create(cabin);

  if (errors) {
    let doesDeleteImageErrorExist = true;
    let deleteRetryCount = 0;
    do {
      const { errors: deleteImageError } = await staffCabinService.deleteFiles(
        [cabin.image.split('/').pop()!],
        'cabin-images'
      );
      if (deleteImageError) doesDeleteImageErrorExist = true;
      ++deleteRetryCount;
    } while (doesDeleteImageErrorExist && deleteRetryCount < 3);

    return [false];
  }

  return [true];
}
