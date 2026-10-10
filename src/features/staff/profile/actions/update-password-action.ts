'use server';

import { Auth } from '@/features/auth';
import { staffService } from '@/services';
import type { ActionResponse } from '@/shared/actions';
import { SignUpSchema } from '@/shared/schemas';
import type { Result } from '@/shared/types';
import { hash } from 'bcrypt';
import z from 'zod';
import { STAFF_TEST_EMAIL } from '../../constants';

const UpdatePasswordSchema = SignUpSchema.pick({
  password: true,
  confirmedPassword: true,
})
  .refine(data => data.password === data.confirmedPassword, {
    message: "Passwords don't match",
    path: ['confirmedPassword'],
  })
  .refine(data => data.password === data.confirmedPassword, {
    message: "Passwords don't match",
    path: ['password'],
  });

type SafeUpdatePasswordInput = z.infer<typeof UpdatePasswordSchema>;
type PartialUpdatePasswordInput = Partial<SafeUpdatePasswordInput>;
type UpdatePasswordError = Partial<
  Record<keyof SafeUpdatePasswordInput, string[]> & { unexpected?: string }
>;
export type UpdatePasswordResponse = ActionResponse<
  PartialUpdatePasswordInput,
  UpdatePasswordError
>;

export async function updatePasswordAction(
  _state: UpdatePasswordResponse,
  formData: FormData
): Promise<UpdatePasswordResponse> {
  await Auth.staff.ensureStaffIsAuthenticatedAsync();
  const accessPayload = await Auth.staff.session.verifyAccessTokenAsync();
  if (!accessPayload)
    throw new Error(
      'Access token is expired but the redirect before did not work'
    );

  if (accessPayload.email === STAFF_TEST_EMAIL)
    throw new Error(
      'You cannot update the password for the staff test account'
    );

  const input = Object.fromEntries(formData.entries());
  const parsedResult = validateInput(input);
  if (parsedResult.type === 'error') return parsedResult.payload;
  const { password } = parsedResult.payload;

  const hashPassword = await hash(password, 10);

  const { errors } = await staffService.update(Number(accessPayload.userId), {
    hash_password: hashPassword,
  });
  if (errors)
    return {
      type: 'error',
      payload: {
        userEntered: input,
        errors: {
          unexpected:
            'An error has occurred while trying to update your password',
        },
        isSuccess: false,
      },
    };

  return {
    type: 'success',
    payload: {
      userEntered: null,
      errors: null,
      isSuccess: true,
    },
  };
}

function validateInput(
  input: Record<PropertyKey, unknown>
): Result<SafeUpdatePasswordInput, UpdatePasswordResponse> {
  const parsedResult = UpdatePasswordSchema.safeParse(input);
  if (parsedResult.success)
    return {
      type: 'success',
      payload: parsedResult.data,
    };

  return {
    type: 'error',
    payload: {
      type: 'error',
      payload: {
        userEntered: input,
        errors: z.flattenError(parsedResult.error).fieldErrors,
        isSuccess: false,
      },
    },
  };
}
