import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

import { unauthGuestService, unauthStaffService } from '@/services';
import { cache } from 'react';

import type { NonNullableObject } from '@/repositories';

import { CookieConfig, ROUTES } from '@/shared/constants';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtManager } from './RsaJwtManager';

const nextAuth = NextAuth({
  providers: [Google],
});

const getThirdPartySessionAsync = cache(async () => {
  return nextAuth.auth();
});

const getCurrentUser = cache(async () => {
  const session = await getThirdPartySessionAsync();

  if (!session?.user?.email) return null;

  return await unauthGuestService.getByEmailAsync(session.user.email);
});

const getFullSessionAsync = cache(async () => {
  const [session, guest] = await Promise.all([
    getThirdPartySessionAsync(),
    getCurrentUser(),
  ]);

  return {
    main: guest,
    thirdParty: session,
  } as const;
});

const verifySession = cache(async () => {
  const session = await getFullSessionAsync();

  if (!session.main) redirect(ROUTES.login.href);

  return session as NonNullableObject<typeof session>; // main exists means third also exists
});

const verifyAccessTokenAsync = cache(async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(
    CookieConfig.keys.staff.token.access
  )?.value;

  if (!accessToken) return null;
  return await jwtManager.verifyAccessTokenAsync(accessToken);
});

const verifyRefreshTokenAsync = cache(async () => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(
    CookieConfig.keys.staff.token.refresh
  )?.value;

  if (!refreshToken) return null;
  return await jwtManager.verifyRefreshTokenAsync(refreshToken);
});

const refreshAccessTokenAsync = cache(async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(
    CookieConfig.keys.staff.token.access
  )?.value;
  const refreshToken = cookieStore.get(
    CookieConfig.keys.staff.token.refresh
  )?.value;

  if (!accessToken || !refreshToken) return null;

  const refreshPayload = await verifyRefreshTokenAsync();
  if (!refreshPayload) return null;
  const { data, errors } = await unauthStaffService.getByEmail(
    refreshPayload.userEmail
  );
  if (errors) return null;

  return await jwtManager.refreshAccessTokenAsync(
    { accessToken, refreshToken },
    data
  );
});

export const Auth = {
  guest: {
    nextAuth,
    getThirdPartySessionAsync,
    getFullSessionAsync,
    verifySession,
  },
  staff: {
    verifyAccessTokenAsync,
    verifyRefreshTokenAsync,
    refreshAccessTokenAsync,
  },
} as const;
