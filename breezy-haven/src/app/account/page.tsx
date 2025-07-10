import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guest area',
};

export default function Page() {
  return (
    <>
      <h1 className='text-accent-400 mb-4 text-xl tracking-widest lg:text-4xl'>
        Welcome, Trí Decent!
      </h1>
    </>
  );
}
