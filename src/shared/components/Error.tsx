export default function Error({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  const isProd = process.env.NODE_ENV === 'production';

  const displayMessage = isProd
    ? 'An error occurred while loading the page. Please try again later.'
    : message;

  return (
    <div className='flex flex-1 flex-col items-center justify-center gap-4'>
      <h1 className='text-2xl font-bold text-red-500 md:text-3xl'>
        Oops! Something went wrong.
      </h1>
      <p className='text-lg'>{displayMessage}</p>
      <button
        onClick={onRetry}
        className='bg-accent-600 hover:bg-accent-600/80 active:bg-accent-600/80 rounded-md px-6 py-4'
      >
        Try again
      </button>
    </div>
  );
}
