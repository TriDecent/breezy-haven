'use server';

import { jwtManager } from '@/lib';
import { staffService } from '@/services';
import type { ActionResponse } from '@/shared/actions';
import { CookieConfig, ROUTES } from '@/shared/constants';

import { compare } from 'bcrypt';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import z from 'zod';

const LoginInputSchema = z.object({
  email: z.email({ message: 'Email must be a valid email' }).trim(),
  password: z
    .string()
    /*  Save this for signup later
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(64, { message: 'Password must be at most 64 characters' })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter',
    })
    .regex(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter',
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, {
      message: 'Password must contain at least one special character',
    })
    */
    .trim(),
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

  const { data, errors } = await staffService.getByEmail(safeInput.email);

  if (errors) return createUnexpectedResponse(safeInput);

  if (!(await compare(safeInput.password, data.hash_password)))
    return createUnexpectedResponse(safeInput);

  const tokens = await jwtManager.createTokensAsync({
    email: data.email,
    avatarUrl: data.avatarUrl,
  });

  const cookieStore = await cookies();

  cookieStore.set(
    CookieConfig.keys.staff.token.access,
    tokens.accessToken,
    CookieConfig.option
  );
  cookieStore.set(
    CookieConfig.keys.staff.token.refresh,
    tokens.refreshToken,
    CookieConfig.option
  );

  redirect(`${ROUTES.staff.nested.dashboard.href}`); // * will be replaced with callbackUrl later

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
