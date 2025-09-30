'use server';

import { Auth } from '@/features/auth';

export async function signinAsync(provider: 'google') {
  await Auth.guest.nextAuth.signIn(provider);
}
