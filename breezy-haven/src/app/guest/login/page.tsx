import { GoogleLogin, LoginCard, LoginForm } from '@/features/guest/login';
import { ROUTES } from '@/shared/constants';

import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = ROUTES.login.metadata;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <section className='flex flex-col items-center gap-10'>
      <h2 className='text-2xl font-semibold lg:text-3xl'>
        Sign in to access your guest area
      </h2>

      <LoginCard
        renderLoginByProviders={<GoogleLogin />}
        renderLoginByEmailPassword={<LoginForm />}
        className='w-full max-w-3xl'
      />

      <Suspense>
        <ErrorDisplay searchParams={searchParams} />
      </Suspense>
    </section>
  );
}

async function ErrorDisplay({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const error = (await searchParams).error;

  return error ? (
    <p className='text-center text-red-500'>
      <span className='uppercase'>{error}</span>: An error occurred while
      logging you in. Please try again!
    </p>
  ) : null;
}
