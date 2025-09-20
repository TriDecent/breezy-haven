'use server';

import { CookieConfig } from '@/shared/constants';
import { cookies } from 'next/headers';

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(CookieConfig.keys.staff.token.access);
  cookieStore.delete(CookieConfig.keys.staff.token.refresh);
}
