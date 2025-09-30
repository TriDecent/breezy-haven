'use server';

import { Auth } from '@/features/auth';
import { fileService, staffService } from '@/services';
import type { ActionResponse } from '@/shared/actions';
import { COOKIES_CONFIG } from '@/shared/constants';
import { SignUpSchema } from '@/shared/schemas';
import type { Result } from '@/shared/types';
import { cookies } from 'next/headers';
import path from 'path';
import z from 'zod';

const UpdateProfileSchema = SignUpSchema.omit({
  password: true,
  confirmedPassword: true,
})
  .extend({
    avatar: z.file({ error: 'Avatar must be an image' }),
  })
  .readonly();

const ImageValidator = z
  .file()
  .refine(file => ['image/jpg', 'image/jpeg', 'image/png'].includes(file.type));

type SafeProfileInput = z.infer<typeof UpdateProfileSchema>;
type PartialProfileInput = Partial<SafeProfileInput>;
type UpdateProfileError = Partial<
  Record<keyof SafeProfileInput, string[]> & { unexpected?: string }
>;
export type UpdateProfileResponse = ActionResponse<
  PartialProfileInput,
  UpdateProfileError
>;

const bucketId = 'avatars';

export async function updateProfileAction(
  _state: UpdateProfileResponse,
  formData: FormData
): Promise<UpdateProfileResponse> {
  await Auth.staff.ensureStaffIsAuthenticatedAsync();

  const input = Object.fromEntries(formData.entries());
  const parsed = validateInput(input);
  if (parsed.type === 'error') return parsed.payload;
  const credential = parsed.payload;

  const isImageValid = ImageValidator.safeParse(credential.avatar).success;
  const result = isImageValid
    ? await updateProfileWithAvatarAsync(credential)
    : await updateProfileWithoutAvatarAsync(credential);

  return (
    result ?? {
      userEntered: null,
      errors: null,
      isSuccess: true,
    }
  );
}

async function updateProfileWithoutAvatarAsync(
  credential: SafeProfileInput
): Promise<UpdateProfileResponse | null> {
  const { accessPayload, refreshPayload } = await ensureValidTokensAsync();

  const [{ errors }, tokens] = await Promise.all([
    staffService.update(Number(refreshPayload.userId), {
      fullName: credential.fullName,
    }),
    Auth.staff.session.createTokensAsync(
      { ...accessPayload, fullName: credential.fullName },
      refreshPayload.absoluteExp
    ),
  ]);

  if (errors || !tokens) {
    return createErrorResponse(credential, {
      unexpected: 'An error has occurred while trying to update the profile',
    });
  }

  await setTokensAsync(tokens);
  return null;
}

async function updateProfileWithAvatarAsync(
  credential: SafeProfileInput
): Promise<UpdateProfileResponse | null> {
  const { accessPayload, refreshPayload } = await ensureValidTokensAsync();

  const uniqueAvatarName = `${credential.avatar.name}-${crypto.randomUUID()}`;
  const uploadResult = await fileService.uploadAsync(
    credential.avatar,
    uniqueAvatarName,
    bucketId
  );

  if (uploadResult.type === 'error') {
    return createErrorResponse(credential, {
      avatar: ['Cannot upload the image, please try again'],
    });
  }

  const newAvatarUrl = path.posix.join(
    process.env.SUPABASE_BUCKET!,
    uploadResult.payload.fullPath
  );

  const [{ errors }, tokens] = await Promise.all([
    staffService.update(Number(refreshPayload.userId), {
      fullName: credential.fullName,
      avatarUrl: newAvatarUrl,
    }),
    Auth.staff.session.createTokensAsync(
      {
        ...accessPayload,
        fullName: credential.fullName,
        avatarUrl: newAvatarUrl,
      },
      refreshPayload.absoluteExp
    ),
  ]);

  if (errors || !tokens) {
    await tryDeleteImageAsync(uniqueAvatarName);
    return createErrorResponse(credential, {
      unexpected: 'An error has occurred while trying to create the new staff',
    });
  }

  await setTokensAsync(tokens);
  return null;
}

async function ensureValidTokensAsync() {
  const [accessPayload, refreshPayload] = await Promise.all([
    Auth.staff.session.verifyAccessTokenAsync(),
    Auth.staff.session.verifyRefreshTokenAsync(),
  ]);

  if (!accessPayload || !refreshPayload) {
    throw new Error('Tokens are expired but the redirect before did not work');
  }
  return { accessPayload, refreshPayload };
}

async function tryDeleteImageAsync(fileName: string) {
  const maxRetryCount = 3;
  for (let retry = 0; retry < maxRetryCount; retry++) {
    const result = await fileService.deleteAsync([fileName], bucketId);
    if (result.type === 'success') break;
  }
}

function validateInput(
  input: Record<PropertyKey, unknown>
): Result<SafeProfileInput, UpdateProfileResponse> {
  const parsed = UpdateProfileSchema.safeParse(input);
  if (!parsed.success) {
    return {
      type: 'error',
      payload: {
        userEntered: input,
        errors: z.flattenError(parsed.error).fieldErrors,
      },
    };
  }
  return { type: 'success', payload: parsed.data };
}

async function setTokensAsync(tokens: {
  accessToken: string;
  refreshToken: string;
}) {
  const cookieStore = await cookies();
  cookieStore.set(
    COOKIES_CONFIG.keys.staff.token.access,
    tokens.accessToken,
    COOKIES_CONFIG.option.short
  );
  cookieStore.set(
    COOKIES_CONFIG.keys.staff.token.refresh,
    tokens.refreshToken,
    COOKIES_CONFIG.option.long
  );
}

function createErrorResponse(
  input: SafeProfileInput,
  errors: UpdateProfileError
): UpdateProfileResponse {
  return {
    userEntered: { ...input, avatar: undefined },
    errors,
  };
}
