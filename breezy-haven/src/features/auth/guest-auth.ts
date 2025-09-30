import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

import { unauthGuestService } from '@/services';
import { cache } from 'react';

import { ROUTES } from '@/shared/constants';
import type { NonNullableObject } from '@/shared/types';
import { redirect } from 'next/navigation';

export const nextAuth = NextAuth({
  providers: [Google],
});

export const getThirdPartySessionAsync = cache(async () => {
  return nextAuth.auth();
});

export const getCurrentUser = cache(async () => {
  const session = await getThirdPartySessionAsync();

  if (!session?.user?.email) return null;

  return await unauthGuestService.getByEmailAsync(session.user.email);
});

export const getFullSessionAsync = cache(async () => {
  const [session, guest] = await Promise.all([
    getThirdPartySessionAsync(),
    getCurrentUser(),
  ]);

  return {
    main: guest,
    thirdParty: session,
  } as const;
});

export const verifySession = cache(async () => {
  const session = await getFullSessionAsync();

  if (!session.main) redirect(ROUTES.login.href);

  return session as NonNullableObject<typeof session>; // main exists means third also exists
});
