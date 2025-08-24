'use client';

export default function GuestError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <section className='flex flex-1 flex-col items-center justify-center gap-4'>
      <h1 className='text-2xl font-bold text-red-500 md:text-3xl'>
        Oops! Something went wrong.
      </h1>
      <p className='text-lg'>{error.message}</p>
      <button
        onClick={reset}
        className='bg-accent-600 hover:bg-accent-600/80 active:bg-accent-600/80 rounded-md px-6 py-4'
      >
        Try again
      </button>
    </section>
  );
}
