'use client';

import { Input, PrimaryButton } from '@/shared/components';
import { InputHTMLAttributes, useActionState, type ReactElement } from 'react';
import type { GuestForm } from './GuestFormSchema';
import { updateProfile } from './updateProfileAction';

export default function UpdateProfileForm({
  guest,
  countrySelector,
}: {
  guest: GuestForm;
  countrySelector: ReactElement;
}) {
  const [state, dispatch, isPending] = useActionState(updateProfile, {
    userEntered: null,
    errors: null,
  });

  return (
    <form
      action={dispatch}
      className='bg-primary-900 flex flex-col gap-6 rounded px-4 py-6 text-lg md:px-8 md:py-12 lg:gap-8'
    >
      <InputForm
        id='fullName'
        name='fullName'
        labelText='Full name'
        autoComplete='name'
        value={guest.fullName}
        readOnly
      />

      <InputForm
        id='email'
        name='email'
        labelText='Email address'
        autoComplete='email'
        value={guest.email}
        readOnly
      />

      <div className='space-y-2'>
        {countrySelector}
        {state.errors?.nationality?.errors?.[0] ? (
          <div className='text-red-500'>{state.errors.nationality.errors}</div>
        ) : null}
      </div>

      <div>
        <InputForm
          id='nationalID'
          labelText='National ID number'
          defaultValue={
            state.userEntered?.nationalID ?? guest.nationalID?.toString()
          }
          name='nationalID'
        />
        {state.errors?.nationalID?.errors?.[0] ? (
          <div className='text-red-500'>{state.errors.nationalID.errors}</div>
        ) : null}
      </div>

      <div className='md:w-fit md:self-center'>
        <PrimaryButton disabled={isPending}>
          {!isPending ? (
            'Update profile'
          ) : (
            <div className='border-accent-500 mx-auto h-5 w-5 animate-spin rounded-full border-2 border-t-transparent'></div>
          )}
        </PrimaryButton>
      </div>
      {state.errors?.authenticated ? (
        <div className='text-red-500t-'>{state.errors.authenticated}</div>
      ) : null}
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
      <Input
        id={id}
        {...props}
        className='read-only:cursor-not-allowed xl:!text-base'
      />
    </div>
  );
}
