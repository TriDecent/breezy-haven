'use server';

import type { ActionResponse } from '@/shared/actions';
import { SignUpSchema, type SignUp } from '@/shared/schemas';
import z from 'zod';

export type SignupError = Partial<
  Record<keyof SignUp, string[]> & { unexpected?: string }
>;
export type SignupResponse = ActionResponse<Partial<SignUp>, SignupError>;

export async function signupAction(
  _state: SignupResponse,
  formData: FormData
): Promise<SignupResponse> {
  const input = Object.fromEntries(formData.entries());
  const parsed = SignUpSchema.safeParse(input);
  if (!parsed.success)
    return {
      type: 'error',
      payload: {
        userEntered: input,
        errors: z.flattenError(parsed.error).fieldErrors,
        isSuccess: false,
      },
    };

  return {
    type: 'error',
    payload: {
      userEntered: parsed.data,
      errors: {
        unexpected: 'This feature is not available yet',
      },
      isSuccess: false,
    },
  };
}
