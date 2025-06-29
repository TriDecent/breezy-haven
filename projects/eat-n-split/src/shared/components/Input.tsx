import type { InputHTMLAttributes } from 'react';

interface IInput {
  readonly id: string;
  readonly labelText: string;
  readonly className?: string;
}

export default function Input({
  id,
  labelText,
  className,
  ...props
}: IInput & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className='flex flex-col md:flex-row md:items-center md:gap-2'>
      <label htmlFor={id} className='mb-1 md:mb-0 md:w-32'>
        {labelText}
      </label>
      <input
        id={id}
        {...props}
        className={`focus:ring-offset-amber-30 min-w-0 flex-1 rounded bg-white px-4 py-1 outline-none focus:ring-1 focus:ring-amber-500 focus:ring-offset-1 ${className ?? ''}`}
      />
    </div>
  );
}
