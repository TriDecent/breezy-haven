'use server';

import { Auth } from '@/features/auth';
import { fileService, staffService } from '@/services';
import type { ActionResponse } from '@/shared/actions';
import { SignUpSchema } from '@/shared/schemas';
import type { Result } from '@/shared/types';
import { hash } from 'bcrypt';
import path from 'path';
import z from 'zod';

const StaffSignUpSchema = SignUpSchema.extend({
  avatar: z
    .file({ error: 'Avatar must be an image' })
    .refine(
      file => ['image/jpg', 'image/jpeg', 'image/png'].includes(file.type),
      {
        error: 'Only JPG, PNG and JPEG images are allowed',
      }
    ),
}).readonly();

type SafeSignUpInput = z.infer<typeof StaffSignUpSchema>;
type PartialSignUpInput = Partial<SafeSignUpInput>;
type CreateStaffError = Partial<
  Record<keyof SafeSignUpInput, string[]> & { unexpected?: string }
>;
export type CreateStaffResponse = ActionResponse<
  PartialSignUpInput,
  CreateStaffError
>;

const bucketId = 'avatars';

export async function createStaffAction(
  _state: CreateStaffResponse,
  formData: FormData
): Promise<CreateStaffResponse> {
  await Auth.staff.ensureStaffIsAuthenticatedAsync();

  const input = Object.fromEntries(formData.entries());
  const parsed = validateInput(input);
  if (parsed.type === 'error') return parsed.payload;
  const credential = parsed.payload;

  const doesEmailExistResult = await getDoesEmailExistAsync(credential.email);
  if (doesEmailExistResult.type === 'error')
    return createErrorResponse(credential, {
      unexpected: 'Something is wrong, please try again!',
    });

  if (doesEmailExistResult.payload)
    return createErrorResponse(credential, {
      email: ['This email address is already in use'],
    });

  const uniqueAvatarName = `${credential.avatar.name}-${crypto.randomUUID()}`;
  const uploadResult = await fileService.uploadAsync(
    credential.avatar,
    uniqueAvatarName,
    bucketId
  );

  if (uploadResult.type === 'error')
    return createErrorResponse(credential, {
      avatar: ['Cannot upload the image, please try again'],
    });

  const hashPassword = await hash(credential.password, 10);
  const { errors } = await staffService.create({
    email: credential.email,
    fullName: credential.fullName,
    hash_password: hashPassword,
    avatarUrl: path.posix.join(
      process.env.SUPABASE_BUCKET!,
      uploadResult.payload.fullPath
    ),
  });

  if (errors) {
    await tryDeleteImageAsync(uniqueAvatarName);

    return createErrorResponse(credential, {
      unexpected: 'An error has occurred while trying to create the new staff',
    });
  }

  return {
    type: 'success',
    payload: {
      userEntered: null,
      errors: null,
      isSuccess: true,
    },
  };
}

async function getDoesEmailExistAsync(
  email: string
): Promise<Result<boolean, undefined>> {
  const { data, errors } = await staffService.getByEmail(email);

  if (data)
    return {
      type: 'success',
      payload: true,
    };

  if (errors && errors.type === 'database' && errors.db.code === 'PGRST116')
    return {
      type: 'success',
      payload: false,
    };
  return {
    type: 'error',
    payload: undefined,
  };
}

async function tryDeleteImageAsync(path: string) {
  const deleteResult = await fileService.deleteAsync([path], bucketId);
  if (deleteResult.type === 'success') return;

  let retryCount = 0;
  const maxRetryCount = 3;

  while (retryCount < maxRetryCount) {
    const deleteResult = await fileService.deleteAsync([path], bucketId);
    if (deleteResult.type === 'success') break;
    ++retryCount;
  }
}

function validateInput(
  input: Record<PropertyKey, unknown>
): Result<SafeSignUpInput, CreateStaffResponse> {
  const parsed = StaffSignUpSchema.safeParse(input);
  if (!parsed.success)
    return {
      type: 'error',
      payload: {
        type: 'error',
        payload: {
          userEntered: input,
          errors: z.flattenError(parsed.error).fieldErrors,
          isSuccess: false,
        },
      },
    };

  return {
    type: 'success',
    payload: { ...parsed.data },
  };
}

function createErrorResponse(
  input: SafeSignUpInput,
  errors: CreateStaffError
): CreateStaffResponse {
  return {
    type: 'error',
    payload: {
      userEntered: {
        ...input,
        avatar: undefined,
      },
      errors,
      isSuccess: false,
    },
  };
}
