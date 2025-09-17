import { Auth } from '@/lib';
import { ROUTES } from '@/shared/constants';

import { Metadata } from 'next';

export function generateMetadata(): Metadata {
  return ROUTES.account.metadata;
}

export default async function AccountPage() {
  const session = await Auth.guest.verifySession();

  return (
    <>
      <h1 className='text-accent-400 mb-4 text-xl tracking-widest lg:text-4xl'>
        Welcome, {session.main.fullName}!
      </h1>
    </>
  );
}
