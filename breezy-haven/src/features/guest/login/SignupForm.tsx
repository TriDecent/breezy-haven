'use client';
import { Form, FormRow } from '@/shared/components';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { signupAction, type SignupResponse } from './signup-action';

export function SignupForm() {
  const handleSignupSuccess = useCallback(
    () => toast.success('Sign up successfully'),
    []
  );
  const handleSignupFailed = useCallback(
    () =>
      //  TODO: change this after implementation
      toast.error("This feature isn't available yet. Please check back later"),
    []
  );

  const renderUnexpectedErrors = useCallback(
    (state: SignupResponse) =>
      state.payload.errors?.unexpected ? (
        <p className='text-red-500'>{state.payload.errors.unexpected}</p>
      ) : null,
    []
  );

  const renderFields = useCallback(
    (state: SignupResponse, isPending: boolean) => (
      <>
        <FormRow
          id='fullName'
          name='fullName'
          labelText='Full name'
          kind='input'
          type='text'
          disabled={isPending}
          autoComplete='name webauthn'
          labelClassname='min-w-36'
          defaultValue={state.payload.userEntered?.fullName}
          error={state.payload.errors?.fullName?.[0]}
        />
        <FormRow
          id='email'
          name='email'
          labelText='Email'
          kind='input'
          type='email'
          disabled={isPending}
          autoComplete='email webauthn'
          labelClassname='min-w-36'
          defaultValue={state.payload.userEntered?.email}
          error={state.payload.errors?.email?.[0]}
        />
        <FormRow
          id='password'
          name='password'
          labelText='Password'
          kind='input'
          type='password'
          disabled={isPending}
          autoComplete='new-password webauthn'
          labelClassname='min-w-36'
          defaultValue={state.payload.userEntered?.password}
          error={state.payload.errors?.password?.[0]}
        />
        <FormRow
          id='confirmedPassword'
          name='confirmedPassword'
          labelText='Repeat password'
          kind='input'
          type='password'
          disabled={isPending}
          labelClassname='min-w-36'
          defaultValue={state.payload.userEntered?.confirmedPassword}
          error={state.payload.errors?.confirmedPassword?.[0]}
        />
      </>
    ),
    []
  );

  return (
    <Form
      action={signupAction}
      initialState={{
        type: 'initial',
        payload: { userEntered: null, errors: null },
      }}
      submitNode={'Sign up'}
      onFormSuccess={handleSignupSuccess}
      onFormError={handleSignupFailed}
      renderUnexpectedErrors={renderUnexpectedErrors}
      renderFields={renderFields}
    />
  );
}
