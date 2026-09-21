'use client';
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/solid';
import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  return (
    <button
      onClick={async () => await signOut()}
      className='hover:bg-primary-900 hover:text-primary-100 text-primary-200 flex w-full items-center gap-4 px-5 py-3 font-semibold transition-colors'
    >
      <ArrowRightStartOnRectangleIcon className='text-primary-600 h-5 w-5' />
      <span>Sign out</span>
    </button>
  );
}
