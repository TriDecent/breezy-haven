import { unauthStaffService } from '@/services';
import { cache } from 'react';

import { refreshTokenRepository } from '@/repositories';

import { CookieConfig } from '@/shared/constants';
import { importJWK } from 'jose';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { RsaJwtManager, type AccessTokenPayload } from './RsaJwtManager';

const BASE64_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY!;
const BASE64_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY!;

const PRIVATE_KEY = (await importJWK(
  JSON.parse(Buffer.from(BASE64_PRIVATE_KEY, 'base64').toString('utf-8')),
  'RS256'
)) as CryptoKey;

const PUBLIC_KEY = (await importJWK(
  JSON.parse(Buffer.from(BASE64_PUBLIC_KEY, 'base64').toString('utf-8')),
  'RS256'
)) as CryptoKey;

const UserPayloadSchema = z.looseObject({
  userId: z.string().readonly(),
  email: z.email().readonly(),
  avatarUrl: z.url().readonly(),
});

type UserPayload = z.infer<typeof UserPayloadSchema> & AccessTokenPayload;

const jwtManager = new RsaJwtManager<UserPayload>(
  { privateKey: PRIVATE_KEY, publicKey: PUBLIC_KEY },
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

export const verifyAccessTokenAsync = cache(async () => {
  const cookieStore = await cookies();
  const accessToken = getTokenFromCookies(
    cookieStore,
    CookieConfig.keys.staff.token.access
  );

  if (!accessToken) return null;
  try {
    return await jwtManager.verifyAccessTokenAsync(accessToken);
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
    return await jwtManager.verifyRefreshTokenAsync(refreshToken);
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
    return await jwtManager.refreshAccessTokenAsync(refreshToken, {
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
      return await jwtManager.verifyAccessTokenAsync(accessToken);
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
      return await jwtManager.verifyRefreshTokenAsync(refreshToken);
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
      return await jwtManager.refreshAccessTokenAsync(refreshToken, {
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
    return await jwtManager.createTokensAsync(payload);
  } catch (e: unknown) {
    console.log(e);
    return null;
  }
});

function getTokenFromCookies(
  store: { get: (key: string) => { value?: string } | undefined },
  key: string
): string | undefined {
  return store.get(key)?.value;
}
