import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

import { unauthGuestService } from '@/services';
import { cache } from 'react';

import type { NonNullableObject } from '@/repositories';
import { ROUTES } from '@/shared';
import { redirect } from 'next/navigation';

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

export const Auth = {
  nextAuth,
  getThirdPartySessionAsync,
  getFullSessionAsync,
  verifySession,
} as const;
