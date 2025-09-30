'use server';

import { Auth } from '@/features/auth';

export async function signoutAction() {
  await Auth.guest.nextAuth.signOut();
}
