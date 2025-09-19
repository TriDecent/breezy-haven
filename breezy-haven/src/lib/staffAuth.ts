import { unauthStaffService } from '@/services';
import { cache } from 'react';

import { refreshTokenRepository } from '@/repositories';

import { CookieConfig, ROUTES } from '@/shared/constants';
import { importJWK } from 'jose';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { RsaJwtManager, type AccessTokenPayload } from './RsaJwtManager';

const getKeysAsync = cache(
  async (): Promise<{
    privateKey: CryptoKey;
    publicKey: CryptoKey;
  }> => {
    const BASE64_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY!;
    const BASE64_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY!;

    const privateKey = (await importJWK(
      JSON.parse(Buffer.from(BASE64_PRIVATE_KEY, 'base64').toString('utf-8')),
      'RS256'
    )) as CryptoKey;

    const publicKey = (await importJWK(
      JSON.parse(Buffer.from(BASE64_PUBLIC_KEY, 'base64').toString('utf-8')),
      'RS256'
    )) as CryptoKey;

    return { privateKey, publicKey };
  }
);

const UserPayloadSchema = z.looseObject({
  userId: z.string().readonly(),
  email: z.email().readonly(),
  avatarUrl: z.url().readonly(),
});

type UserPayload = z.infer<typeof UserPayloadSchema> & AccessTokenPayload;

const getJwtManagerAsync = cache(async () => {
  const { privateKey, publicKey } = await getKeysAsync();

  return new RsaJwtManager<UserPayload>(
    { privateKey, publicKey },
    {
      algorithm: 'RS256',
      issuer: 'The Breezy Haven',
      audience: ['staff'],
      accessExpiresIn: process.env.NODE_ENV === 'development' ? '30d' : '1h',
      refreshExpireIn: process.env.NODE_ENV === 'development' ? '30d' : '7d',
    },
    refreshTokenRepository,
    UserPayloadSchema
  );
});

export const verifyAccessTokenAsync = cache(async () => {
  const cookieStore = await cookies();
  const accessToken = getTokenFromCookies(
    cookieStore,
    CookieConfig.keys.staff.token.access
  );

  if (!accessToken) return null;
  try {
    return await (
      await getJwtManagerAsync()
    ).verifyAccessTokenAsync(accessToken);
  } catch (e: unknown) {
    console.log(e);
    return null;
  }
});

export const verifyRefreshTokenAsync = cache(async () => {
  const cookieStore = await cookies();
  const refreshToken = getTokenFromCookies(
    cookieStore,
    CookieConfig.keys.staff.token.refresh
  );

  if (!refreshToken) return null;

  try {
    return await (
      await getJwtManagerAsync()
    ).verifyRefreshTokenAsync(refreshToken);
  } catch (e: unknown) {
    console.log(e);
    return null;
  }
});

export const refreshAccessTokenAsync = cache(async () => {
  const cookieStore = await cookies();

  const refreshToken = getTokenFromCookies(
    cookieStore,
    CookieConfig.keys.staff.token.refresh
  );

  if (!refreshToken) return null;

  const refreshPayload = await verifyRefreshTokenAsync();
  if (!refreshPayload) return null;
  const { data, errors } = await unauthStaffService.getByEmail(
    refreshPayload.userId
  );
  if (errors) return null;

  try {
    return await (
      await getJwtManagerAsync()
    ).refreshAccessTokenAsync(refreshToken, {
      userId: data.email,
      ...data,
    });
  } catch (e: unknown) {
    console.log(e);
    return null;
  }
});

export const verifyAccessTokenAsyncFromRequest = cache(
  async (request: NextRequest) => {
    const accessToken = getTokenFromCookies(
      request.cookies,
      CookieConfig.keys.staff.token.access
    );

    if (!accessToken) return null;

    try {
      return await (
        await getJwtManagerAsync()
      ).verifyAccessTokenAsync(accessToken);
    } catch (e: unknown) {
      console.log(e);
      return null;
    }
  }
);

export const verifyRefreshTokenAsyncFromRequest = cache(
  async (request: NextRequest) => {
    const refreshToken = getTokenFromCookies(
      request.cookies,
      CookieConfig.keys.staff.token.refresh
    );

    if (!refreshToken) return null;

    try {
      return await (
        await getJwtManagerAsync()
      ).verifyRefreshTokenAsync(refreshToken);
    } catch (e: unknown) {
      console.log(e);
      return null;
    }
  }
);

export const refreshAccessTokenAsyncFromRequest = cache(
  async (request: NextRequest) => {
    const refreshToken = getTokenFromCookies(
      request.cookies,
      CookieConfig.keys.staff.token.refresh
    );

    if (!refreshToken) return null;

    const refreshPayload = await verifyRefreshTokenAsyncFromRequest(request);
    if (!refreshPayload) return null;

    const { data, errors } = await unauthStaffService.getByEmail(
      refreshPayload.userId
    );

    if (errors) return null;

    try {
      return await (
        await getJwtManagerAsync()
      ).refreshAccessTokenAsync(refreshToken, {
        userId: data.email,
        ...data,
      });
    } catch (e: unknown) {
      console.log(e);
      return null;
    }
  }
);

export const createTokensAsync = cache(async (payload: UserPayload) => {
  try {
    return await (await getJwtManagerAsync()).createTokensAsync(payload);
  } catch (e: unknown) {
    console.log(e);
    return null;
  }
});

export const ensureStaffIsAuthenticatedFromRequestAsync = cache(
  async (request: NextRequest): Promise<NextResponse> => {
    const [accessPayload, refreshPayload] = await Promise.all([
      verifyAccessTokenAsyncFromRequest(request),
      verifyRefreshTokenAsyncFromRequest(request),
    ]);

    if (accessPayload) return NextResponse.next();

    if (!refreshPayload)
      return NextResponse.redirect(new URL(ROUTES.login.href, request.nextUrl));

    const tokens = await refreshAccessTokenAsyncFromRequest(request);
    if (!tokens)
      return NextResponse.redirect(new URL(ROUTES.login.href, request.nextUrl));

    const response = NextResponse.next();
    response.cookies.set(
      CookieConfig.keys.staff.token.access,
      tokens.accessToken,
      CookieConfig.option.short
    );
    response.cookies.set(
      CookieConfig.keys.staff.token.refresh,
      tokens.refreshToken,
      CookieConfig.option.long
    );

    return response;
  }
);

export const ensureStaffIsAuthenticatedAsync = cache(async () => {
  const [accessPayload, refreshPayload] = await Promise.all([
    verifyAccessTokenAsync(),
    verifyRefreshTokenAsync(),
  ]);

  if (accessPayload) return;
  if (!refreshPayload) redirect(ROUTES.login.href);

  const tokens = await refreshAccessTokenAsync();
  if (!tokens) redirect(ROUTES.login.href);

  console.log('có xuống không')

  const cookieStore = await cookies();
  cookieStore.set(
    CookieConfig.keys.staff.token.access,
    tokens.accessToken,
    CookieConfig.option.short
  );
  cookieStore.set(
    CookieConfig.keys.staff.token.refresh,
    tokens.refreshToken,
    CookieConfig.option.long
  );
});

function getTokenFromCookies(
  store: { get: (key: string) => { value?: string } | undefined },
  key: string
): string | undefined {
  return store.get(key)?.value;
}
