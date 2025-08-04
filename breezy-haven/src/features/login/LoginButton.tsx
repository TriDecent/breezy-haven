'use client';

import { login } from '@/lib';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

export default function LoginButton() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/account';

  return (
    <form action={() => login('google', callbackUrl)}>
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
