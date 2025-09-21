'use server';

import { Auth } from '@/lib';
import { fileService, staffService } from '@/services';
import type { ActionResponse } from '@/shared/actions';
import type { Result } from '@/shared/types';
import { hash } from 'bcrypt';
import path from 'path';
import z from 'zod';

const SignUpSchema = z
  .object({
    email: z.email({ error: 'Email must be a valid email' }).trim(),
    password: z
      .string()
      .min(8, { error: 'Password must be at least 8 characters' })
      .max(64, { error: 'Password must be at most 64 characters' })
      .regex(/[A-Z]/, {
        error: 'Password must contain at least one uppercase letter',
      })
      .regex(/[a-z]/, {
        error: 'Password must contain at least one lowercase letter',
      })
      .regex(/[0-9]/, { error: 'Password must contain at least one number' })
      .regex(/[^A-Za-z0-9]/, {
        error: 'Password must contain at least one special character',
      })
      .trim(),
    confirmedPassword: z.string().trim(),
    fullName: z
      .string()
      .min(2, { error: 'Full name must be at least 2 characters' })
      .max(64, { error: 'Full name must be at most 64 characters' })
      .trim(),
    avatar: z
      .file({ error: 'Avatar must be an image' })
      .refine(
        file => ['image/jpg', 'image/jpeg', 'image/png'].includes(file.type),
        {
          error: 'Only JPG, PNG and JPEG images are allowed',
        }
      ),
  })
  .refine(data => data.password === data.confirmedPassword, {
    message: "Passwords don't match",
    path: ['confirmedPassword'],
  })
  .refine(data => data.password === data.confirmedPassword, {
    message: "Passwords don't match",
    path: ['password'],
  })
  .readonly();

type SafeSignUpInput = z.infer<typeof SignUpSchema>;
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
    userEntered: null,
    errors: null,
    isSuccess: true,
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
  const parsed = SignUpSchema.safeParse(input);
  if (!parsed.success)
    return {
      type: 'error',
      payload: {
        userEntered: input,
        errors: z.flattenError(parsed.error).fieldErrors,
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
    userEntered: {
      ...input,
      avatar: undefined,
    },
    errors,
  };
}
