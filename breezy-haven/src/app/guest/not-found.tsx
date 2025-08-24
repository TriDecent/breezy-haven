import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page not found',
  description: 'The page you are looking for does not exist.',
};

export default function GuestNotFound() {
  return (
    <section className='flex flex-1 items-center justify-center space-x-6 py-8'>
      <h1 className='border-r border-black pr-6 text-3xl leading-relaxed font-semibold dark:border-white'>
        404
      </h1>
      <div>
        <h2 className='m-0 text-base leading-normal font-normal'>
          This page could not be found
        </h2>
      </div>
    </section>
  );
}
