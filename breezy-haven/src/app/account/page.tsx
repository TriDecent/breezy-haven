import { Auth } from '@/lib';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guest area',
};

export default async function AccountPage() {
  const session = await Auth.getFullSessionAsync();

  if (!session?.main) return <p>You are not authorized to visit this route.</p>;

  return (
    <>
      <h1 className='text-accent-400 mb-4 text-xl tracking-widest lg:text-4xl'>
        Welcome, {session.main.fullName}!
      </h1>
    </>
  );
}
