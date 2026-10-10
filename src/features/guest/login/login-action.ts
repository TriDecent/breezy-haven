'use server';

import { Auth } from '@/features/auth';
import { unauthStaffService } from '@/services';
import type { ActionResponse } from '@/shared/actions';
import { COOKIES_CONFIG } from '@/shared/constants';
import { compare } from 'bcrypt';
import type { User } from 'next-auth';
import { encode } from 'next-auth/jwt';
import { cookies } from 'next/headers';
import z from 'zod';
import { GUEST_TEST_EMAIL } from './constants';

const LoginInputSchema = z.object({
  email: z.email({ message: 'Email must be a valid email' }).trim(),
  password: z.string().min(8).trim(),
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

  if (validateResult.type === 'response') return validateResult.payload;

  const safeInput = validateResult.parsed;

  const { data, errors } = await unauthStaffService.getByEmail(safeInput.email);

  if (errors) return createUnexpectedResponse(safeInput);

  if (!(await compare(safeInput.password, data.hash_password)))
    return createUnexpectedResponse(safeInput);

  // ! TEMP
  if (safeInput.email === GUEST_TEST_EMAIL)
    return applyGuestWorkaround({ ...data, id: data.id.toString() });

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
    type: 'success',
    payload: {
      userEntered: null,
      errors: null,
      isSuccess: true,
    },
  };
}

async function applyGuestWorkaround(guest: User): Promise<LoginActionResponse> {
  const isProd = process.env.NODE_ENV === 'production';
  const cookieName = isProd
    ? '__Secure-authjs.session-token'
    : 'authjs.session-token';

  const token = await encode({
    token: guest,
    secret: process.env.AUTH_SECRET as string,
    salt: cookieName,
  });

  (await cookies()).set({
    name: cookieName,
    value: token,
    httpOnly: true,
    secure: isProd,
    path: '/',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60,
  });

  return {
    type: 'success',
    payload: { userEntered: null, errors: null, isSuccess: true },
  };
}

function validateFormData(
  formData: FormData
):
  | { type: 'response'; payload: LoginActionResponse }
  | { type: 'validate'; parsed: SafeLoginInput } {
  const input = Object.fromEntries(formData.entries());
  const parsedResult = LoginInputSchema.safeParse(input);

  if (!parsedResult.success)
    return {
      type: 'response',
      payload: {
        type: 'error',
        payload: {
          userEntered: input,
          errors: z.flattenError(parsedResult.error).fieldErrors,
          isSuccess: false,
        },
      },
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
    type: 'error',
    payload: {
      userEntered,
      errors: {
        unexpected:
          'Login unsuccessful. Please try again or check your email and password.',
      },
      isSuccess: false,
    },
  };
}
