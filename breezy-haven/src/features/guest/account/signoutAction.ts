'use server';

import { Auth } from '@/lib';

export async function signoutAsync() {
  await Auth.guest.nextAuth.signOut();
}
