import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

import { guestSetupService } from '@/services';
import { cache } from 'react';

const nextAuth = NextAuth({
  providers: [Google],
});

const getThirdPartySessionAsync = cache(async () => {
  return nextAuth.auth();
});

const getCurrentUser = cache(async () => {
  const session = await getThirdPartySessionAsync();

  if (!session?.user?.email) return null;

  return await guestSetupService.getByEmailAsync(session.user.email);
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

export const Auth = {
  nextAuth,
  getThirdPartySessionAsync,
  getFullSessionAsync,
} as const;
