'use server';

import { Auth } from './auth';

export async function login(provider: 'google', redirectTo: string) {
  await Auth.signIn(provider, { redirectTo });
}
