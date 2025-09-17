'use server';

import { Auth } from '@/lib';

export async function signinAsync(provider: 'google') {
  await Auth.guest.nextAuth.signIn(provider);
}
