'use server';

import { COOKIES_CONFIG } from '@/shared/constants';
import { cookies } from 'next/headers';

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIES_CONFIG.keys.staff.token.access);
  cookieStore.delete(COOKIES_CONFIG.keys.staff.token.refresh);
}
