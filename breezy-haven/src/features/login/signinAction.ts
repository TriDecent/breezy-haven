'use server';

import { Auth } from '@/lib';

export async function signinAsync(provider: 'google') {
  await Auth.nextAuth.signIn(provider);
}
