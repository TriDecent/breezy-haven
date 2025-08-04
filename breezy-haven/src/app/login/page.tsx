import { Auth } from '@/lib';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <section className='flex flex-col items-center gap-10'>
      <h2 className='text-2xl font-semibold lg:text-3xl'>
        Sign in to access your guest area
      </h2>
      <LoginButton />
    </section>
  );
}

function LoginButton() {
  return (
    <form
      action={async () => {
        'use server';
        await Auth.signIn('google', { redirectTo: '/account' });
      }}
    >
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
