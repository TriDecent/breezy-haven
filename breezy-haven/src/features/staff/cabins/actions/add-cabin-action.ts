'use server';
import { fileService, staffCabinService } from '@/services';

import { Auth } from '@/features/auth';
import { ROUTES } from '@/shared/constants';
import type { Cabin } from '@/shared/schemas';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import { AddCabinSchema, type AddActionResponse } from './types';

export async function addCabinAction(
  _currentState: AddActionResponse,
  formData: FormData
): Promise<AddActionResponse> {
  await Auth.staff.ensureStaffIsAuthenticatedAsync();

  const input = Object.fromEntries(formData.entries());

  const parsedInput = AddCabinSchema.safeParse(input);

  if (!parsedInput.success) {
    const errors = z.flattenError(parsedInput.error).fieldErrors;

    return {
      type: 'error',
      payload: {
        userEntered: input,
        errors: errors,
        isSuccess: false,
      },
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
      type: 'error',
      payload: {
        userEntered: userEnteredWithoutImage,
        errors: {
          image: ['Upload image failed!.'],
        },
        isSuccess: false,
      },
    };

  const [doesCreateCabinSuccess] = await createCabinAsync({
    ...parsedInput.data,
    image: `${process.env.SUPABASE_BUCKET}/${uploadResult.fullPath}`,
  });

  if (!doesCreateCabinSuccess)
    return {
      type: 'error',
      payload: {
        userEntered: userEnteredWithoutImage,
        errors: {
          unexpected:
            'An error occurred while trying to add a new a cabin. Please try again!',
        },
        isSuccess: false,
      },
    };

  revalidatePath(ROUTES.staff.nested.cabins.href);
  revalidatePath(ROUTES.cabins.href);

  return {
    type: 'success',
    payload: {
      userEntered: null,
      errors: null,
      isSuccess: true,
    },
  };
}

async function uploadImageAsync(
  path: string,
  image: File
): Promise<
  [success: { id: string; path: string; fullPath: string }] | [success: null]
> {
  const uploadResult = await fileService.uploadAsync(
    image,
    path,
    'cabin-images'
  );

  if (uploadResult.type === 'error') return [null];

  return [uploadResult.payload];
}

async function createCabinAsync(
  cabin: Omit<Cabin, 'id' | 'created_at'>
): Promise<[success: boolean]> {
  const { errors } = await staffCabinService.create(cabin);

  if (errors) {
    let doesDeleteImageErrorExist = true;
    let deleteRetryCount = 0;
    do {
      const deleteResult = await fileService.deleteAsync(
        [cabin.image.split('/').pop()!],
        'cabin-images'
      );
      if (deleteResult.type === 'error') doesDeleteImageErrorExist = !!errors;
      ++deleteRetryCount;
    } while (doesDeleteImageErrorExist && deleteRetryCount < 3);

    return [false];
  }

  return [true];
}
