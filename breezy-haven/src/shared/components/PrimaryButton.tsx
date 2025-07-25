import { HTMLAttributes } from 'react';

export default function PrimaryButton({
  children,
  ...props
}: HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className='bg-accent-500 text-primary-800 hover:bg-accent-600 w-full rounded-md px-4 py-2 font-semibold transition-all hover:cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300 lg:px-8 lg:py-4'
    >
      {children}
    </button>
  );
}
