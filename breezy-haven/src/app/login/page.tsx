import { LoginButton } from '@/features/login';
import { METADATA } from '@/shared';
import { Metadata } from 'next';

export const metadata: Metadata = METADATA.login.metadata;

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
