import { LoginButton } from '@/features/login';
import { ROUTES } from '@/shared';
import { Metadata } from 'next';

export const metadata: Metadata = ROUTES.login.metadata;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const error = (await searchParams).error;

  return (
    <section className='flex flex-col items-center gap-10'>
      <h2 className='text-2xl font-semibold lg:text-3xl'>
        Sign in to access your guest area
      </h2>
      <LoginButton />
      {error ? (
        <p className='text-center text-red-500'>
          <span className='uppercase'>{error}</span>: An error occurred while
          logging you in. Please try again!
        </p>
      ) : null}
    </section>
  );
}
