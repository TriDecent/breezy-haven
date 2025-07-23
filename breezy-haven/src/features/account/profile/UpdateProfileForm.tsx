'use client';

import countryFlag from '@/../public/germany.webp';
import Image from 'next/image';
import { InputHTMLAttributes } from 'react';

export default function UpdateProfileForm({
  countrySelector,
}: {
  countrySelector: React.ReactElement;
}) {
  return (
    <form className='bg-primary-900 flex flex-col gap-6 rounded px-4 py-6 text-lg md:px-8 md:py-12 lg:gap-8'>
      <InputForm
        id='fullName'
        name='fullName'
        labelText='Full name'
        autoComplete='name'
        disabled
      />

      <InputForm
        id='email'
        name='email'
        labelText='Email address'
        autoComplete='email'
        disabled
      />

      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <label htmlFor='nationality'>Where are you from?</label>
          <Image
            src={countryFlag}
            alt='Country flag'
            className='h-16 w-16 rounded-full'
          />
        </div>
      </div>

      {countrySelector}

      <InputForm
        id='nationalID'
        labelText='National ID number'
        name='nationalID'
      />

      <button className='bg-accent-500 text-primary-800 hover:bg-accent-600 rounded-md px-4 py-2 font-semibold transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300 md:w-fit md:self-center md:px-8 md:py-4'>
        Update profile
      </button>
    </form>
  );
}

function InputForm({
  id,
  labelText,
  ...props
}: { id: string; labelText: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className='space-y-2'>
      <label htmlFor={id}>{labelText}</label>
      <input
        id={id}
        {...props}
        className='bg-primary-200 text-primary-800 w-full rounded-sm px-5 py-3 shadow-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400'
      />
    </div>
  );
}
