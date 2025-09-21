'use client';
import { Button, CardAction, FormRow } from '@/shared/components';
import { Pen } from 'lucide-react';
import Form from 'next/form';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  createStaffAction,
  type CreateStaffResponse,
} from './createStaffAction';

const useStaffCreationForm = (state: CreateStaffResponse) => {
  useEffect(() => {
    if (!state.isSuccess) return;
    toast.success('Create new staff successfully!');
  }, [state]);

  useEffect(() => {
    if (!state.errors) return;
    toast.error('Create new staff failed!');
  }, [state]);
};

export function StaffCreationForm() {
  const [state, dispatch, isPending] = useActionState<
    CreateStaffResponse,
    FormData
  >(createStaffAction, {
    errors: null,
    userEntered: null,
  });

  useStaffCreationForm(state);

  return (
    <Form action={dispatch} className='flex flex-col gap-6'>
      <FormRow
        id='fullName'
        name='fullName'
        labelText='Full name'
        kind='input'
        type='text'
        readOnly={isPending}
        autoComplete='name webauthn'
        labelClassname='min-w-36'
        defaultValue={state.userEntered?.fullName}
        error={state.errors?.fullName?.[0]}
      />
      <FormRow
        id='email'
        name='email'
        labelText='Email'
        kind='input'
        type='email'
        readOnly={isPending}
        autoComplete='email webauthn'
        labelClassname='min-w-36'
        defaultValue={state.userEntered?.email}
        error={state.errors?.email?.[0]}
      />
      <FormRow
        id='password'
        name='password'
        labelText='Password'
        kind='input'
        type='password'
        readOnly={isPending}
        autoComplete='new-password webauthn'
        labelClassname='min-w-36'
        defaultValue={state.userEntered?.password}
        error={state.errors?.password?.[0]}
      />
      <FormRow
        id='confirmedPassword'
        name='confirmedPassword'
        labelText='Repeat password'
        kind='input'
        type='password'
        readOnly={isPending}
        labelClassname='min-w-36'
        defaultValue={state.userEntered?.confirmedPassword}
        error={state.errors?.confirmedPassword?.[0]}
      />

      <CardAction className='flex gap-4 self-end'>
        <Button variant='ghost' type='reset' disabled={isPending}>
          Cancel
        </Button>
        <Button variant='secondary' type='submit' disabled={isPending}>
          <Pen /> Create new user
        </Button>
      </CardAction>
      {state.errors?.unexpected ? (
        <p className='text-red-500'>{state.errors.unexpected}</p>
      ) : null}
    </Form>
  );
}
