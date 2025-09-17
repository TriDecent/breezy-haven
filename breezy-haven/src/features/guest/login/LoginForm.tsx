'use client';

import { Button, Input, Label } from '@/shared';
import Form from 'next/form';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { loginAction, type LoginActionResponse } from './loginAction';

export function LoginForm() {
  const [state, dispatch, isPending] = useActionState<
    LoginActionResponse,
    FormData
  >(loginAction, {
    userEntered: null,
    errors: null,
  });

  useEffect(() => {
    if (!state.isSuccess) return;
    toast.success('Login successfully!');
  }, [state]);

  useEffect(() => {
    if (!state.errors) return;
    toast.error('An error has occurred while trying to login!');
  }, [state]);

  return (
    <Form action={dispatch} className='grid gap-6'>
      <div className='grid gap-3'>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          type='email'
          name='email'
          placeholder='m@example.com'
          autoComplete='email webauthn'
          defaultValue={state.userEntered?.email}
          readOnly={isPending}
        />
        {state.errors?.email ? (
          <p className='text-red-500'>{state.errors.email}</p>
        ) : null}
      </div>
      <div className='grid gap-3'>
        <Label htmlFor='password'>Password</Label>
        <Input
          id='password'
          type='password'
          name='password'
          readOnly={isPending}
        />
        {state.errors?.password ? (
          <p className='text-red-500'>
            {state.errors.password.map(error => (
              <span key={error} className='flex flex-col gap-2'>
                {error}
              </span>
            ))}
          </p>
        ) : null}
      </div>
      <Button
        type='submit'
        variant='secondary'
        disabled={isPending}
        className='w-full'
      >
        Login
      </Button>
      {state.errors?.unexpected ? (
        <p className='text-red-500'>{state.errors.unexpected}</p>
      ) : null}
    </Form>
  );
}
