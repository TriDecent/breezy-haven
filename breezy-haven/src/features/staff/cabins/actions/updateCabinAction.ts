'use server';
import { staffCabinService } from '@/services';
import { ROUTES, type Cabin } from '@/shared';
import { revalidatePath } from 'next/cache';
import path from 'path';
import z from 'zod';
import {
  SafeUpdateCabinInput,
  UpdateCabinSchema,
  type FailedResponse,
  type Result,
  type UpdateActionResponse,
} from './types';

export async function updateCabinAction(
  _currentState: UpdateActionResponse,
  formData: FormData
): Promise<UpdateActionResponse> {
  // TODO: verify staff authentication

  const input = Object.fromEntries(formData.entries());

  const [parsedInput, failed] = validateInput(input);

  const userEnteredWithoutImage = Object.fromEntries(
    Object.entries(input).filter(([key]) => key !== 'image')
  );

  if (failed) return { ...failed, userEntered: userEnteredWithoutImage };

  let updatedCabin: Cabin | undefined = undefined;

  if (!parsedInput.image) {
    const [cabin, failed] = await handleWithoutImageUploadAsync(
      parsedInput,
      userEnteredWithoutImage
    );

    if (failed) return failed;

    updatedCabin = cabin;
  }

  if (parsedInput.image) {
    const [cabin, failed] = await handleWithImageUploadAsync(
      { ...parsedInput, image: parsedInput.image }, // don't even know why Ts cannot infer that parsedInput has image is File but File | undefined, that's why spread is needed
      userEnteredWithoutImage
    );

    if (failed) return failed;

    updatedCabin = cabin;
  }

  revalidatePath(ROUTES.staff.nested.cabins.href);
  revalidatePath(ROUTES.cabins.href);
  revalidatePath(`${ROUTES.cabins.href}/${parsedInput.id}`);

  return {
    userEntered: null,
    error: null,
    success: true,
    updatedCabin,
  };
}

/*
 * WARNING: Do NOT change FailedResponse<T> to ActionResponse<T> in return type!
 * If using ActionResponse, the failed tuple becomes union of both success & failed branches,
 * which breaks spread operations like {...failed, userEntered: override} due to type conflicts
 * between SuccessResponse.userEntered (null) and override value types.
 */
function validateInput(
  input: Readonly<Record<string, FormDataEntryValue>>
): Result<SafeUpdateCabinInput, FailedResponse<SafeUpdateCabinInput>> {
  const parsedInput = UpdateCabinSchema.safeParse(input);

  if (!parsedInput.success) {
    const errors = z.flattenError(parsedInput.error).fieldErrors;

    return [
      null,
      {
        userEntered: input,
        error: errors,
      },
    ];
  }

  return [parsedInput.data, null];
}

async function handleWithoutImageUploadAsync(
  cabin: Omit<Cabin, 'image' | 'created_at'>,
  input: Record<string, FormDataEntryValue>
): Promise<Result<Cabin, FailedResponse<SafeUpdateCabinInput>>> {
  const [updatedCabin] = await updateCabinAsync(cabin.id, cabin);

  if (!updatedCabin)
    return [
      null,
      {
        userEntered: input,
        error: {
          unexpected:
            'An error occurred while trying to update the cabin. Please try again!',
        },
      },
    ];

  return [updatedCabin, null];
}

async function handleWithImageUploadAsync(
  cabin: SafeUpdateCabinInput & { image: File },
  input: Record<string, FormDataEntryValue>
): Promise<Result<Cabin, FailedResponse<SafeUpdateCabinInput>>> {
  const fileName = `${crypto.randomUUID()}-${cabin.image.name}`;

  const [uploadResult] = await uploadImageAsync(fileName, cabin.image);

  if (!uploadResult)
    return [
      null,
      {
        userEntered: input,
        error: {
          unexpected:
            'An error has occurred while trying to upload your image!',
        },
      },
    ];

  const [updatedCabin] = await updateCabinAsync(cabin.id, {
    ...cabin,
    image: path.posix.join(
      process.env.SUPABASE_BUCKET ?? '',
      uploadResult.fullPath
    ),
  });

  if (!updatedCabin) {
    await deleteCabinImageAsync(cabin.image.name);
    return [
      null,
      {
        userEntered: input,
        error: {
          unexpected:
            'An error occurred while trying to update the cabin. Please try again!',
        },
      },
    ];
  }

  return [updatedCabin, null];
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

async function updateCabinAsync(
  cabinId: Cabin['id'],
  updatedFields: Partial<Cabin>
): Promise<[success: Cabin | null]> {
  const { data, errors } = await staffCabinService.update(
    cabinId,
    updatedFields
  );

  if (errors) return [null];

  return [data];
}

async function deleteCabinImageAsync(path: string): Promise<void> {
  let deleteRetryCount = 0;
  let hasError = true;

  do {
    const { errors } = await staffCabinService.deleteFiles(
      [path],
      'cabin-images'
    );
    hasError = !!errors;
    deleteRetryCount++;
  } while (hasError && deleteRetryCount < 3);
}
