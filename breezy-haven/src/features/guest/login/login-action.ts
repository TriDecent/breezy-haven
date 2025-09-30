'use server';

import { Auth } from '@/features/auth';
import { unauthStaffService } from '@/services';
import type { ActionResponse } from '@/shared/actions';
import { COOKIES_CONFIG } from '@/shared/constants';

import { compare } from 'bcrypt';
import { cookies } from 'next/headers';
import z from 'zod';

const LoginInputSchema = z.object({
  email: z.email({ message: 'Email must be a valid email' }).trim(),
  password: z.string().trim(),
});

type SafeLoginInput = z.infer<typeof LoginInputSchema>;
type PartialLoginInput = Partial<SafeLoginInput>;
type LoginInputErrors = Partial<
  Record<keyof SafeLoginInput, readonly string[]>
>;

export type LoginActionResponse = ActionResponse<
  PartialLoginInput,
  LoginInputErrors & { readonly unexpected?: string }
>;

export async function loginAction(
  state: LoginActionResponse,
  formData: FormData
): Promise<LoginActionResponse> {
  const validateResult = validateFormData(formData);

  if (validateResult.type === 'response') return validateResult;

  const safeInput = validateResult.parsed;

  const { data, errors } = await unauthStaffService.getByEmail(safeInput.email);

  if (errors) return createUnexpectedResponse(safeInput);

  if (!(await compare(safeInput.password, data.hash_password)))
    return createUnexpectedResponse(safeInput);

  const tokens = await Auth.staff.session.createTokensAsync({
    userId: data.id.toString(),
    email: data.email,
    avatarUrl: data.avatarUrl,
    fullName: data.fullName,
  });

  if (!tokens) return createUnexpectedResponse(safeInput);

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

  return {
    userEntered: null,
    errors: null,
    isSuccess: true,
  };
}

function validateFormData(
  formData: FormData
):
  | ({ type: 'response' } & LoginActionResponse)
  | ({ type: 'validate' } & { parsed: SafeLoginInput }) {
  const input = Object.fromEntries(formData.entries());
  const parsedResult = LoginInputSchema.safeParse(input);

  if (!parsedResult.success)
    return {
      type: 'response',
      errors: z.flattenError(parsedResult.error).fieldErrors,
      userEntered: input,
    };

  return {
    type: 'validate',
    parsed: { ...parsedResult.data },
  };
}

function createUnexpectedResponse(
  userEntered: SafeLoginInput
): LoginActionResponse {
  return {
    userEntered,
    errors: {
      unexpected:
        'Login unsuccessful. Please try again or check your email and password.',
    },
  };
}
