import { guestRepository } from '@/repositories';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

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

  const guest = await guestRepository.getByEmailAsync(session.user.email);

  return guest;
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
  getCurrentUser,
  getFullSessionAsync,
} as const;
