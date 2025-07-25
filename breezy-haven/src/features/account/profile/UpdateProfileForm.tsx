'use client';

import countryFlag from '@/../public/germany.webp';
import { PrimaryButton } from '@/shared';
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

      <div className='md:w-fit md:self-center'>
        <PrimaryButton>Update profile</PrimaryButton>
      </div>
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
