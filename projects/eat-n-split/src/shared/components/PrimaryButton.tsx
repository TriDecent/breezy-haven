import type { ButtonHTMLAttributes } from 'react';

export default function PrimaryButton({
  children,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded bg-amber-500 px-4 py-1 font-semibold transition duration-200 hover:cursor-pointer hover:bg-amber-500/75 active:bg-amber-500/75 md:w-fit md:min-w-32 ${className} hover:shadow-[0_0_15px] hover:shadow-amber-500`}
    >
      {children}
    </button>
  );
}
