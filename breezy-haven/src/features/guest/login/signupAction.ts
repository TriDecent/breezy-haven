'use server';

import type { SignupResponse } from '@/shared/components/auth';
import { SignUpSchema } from '@/shared/schemas';
import z from 'zod';

export async function signupAction(
  _state: SignupResponse,
  formData: FormData
): Promise<SignupResponse> {
  const input = Object.fromEntries(formData.entries());
  const parsed = SignUpSchema.safeParse(input);
  if (!parsed.success)
    return {
      userEntered: input,
      errors: z.flattenError(parsed.error).fieldErrors,
    };

  return {
    userEntered: input,
    errors: {
      unexpected: 'This feature is not available yet',
    },
  };
}
