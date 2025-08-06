'use server';

import { Auth } from './auth';

export async function loginAsync(provider: 'google') {
  await Auth.nextAuth.signIn(provider);
}

export async function logoutAsync() {
  await Auth.nextAuth.signOut();
}
