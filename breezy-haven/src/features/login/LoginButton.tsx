'use client';

import { loginAsync } from '@/lib/actions';
import Image from 'next/image';

export default function LoginButton() {
  return (
    <form action={async () => await loginAsync('google')}>
      <button className='border-primary-300/30 flex items-center gap-6 rounded border border-solid px-10 py-4 text-lg font-medium hover:cursor-pointer'>
        <Image
          src='https://authjs.dev/img/providers/google.svg'
          alt='Google logo'
          height='24'
          width='24'
        />
        <span>Continue with Google</span>
      </button>
    </form>
  );
}
