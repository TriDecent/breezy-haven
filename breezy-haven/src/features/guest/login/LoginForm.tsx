'use client';

import { Button, FormRow } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { stagger, useAnimate } from 'framer-motion';
import Form from 'next/form';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { loginAction, type LoginActionResponse } from './login-action';

export function LoginForm() {
  const [state, dispatch, isPending] = useActionState<
    LoginActionResponse,
    FormData
  >(loginAction, {
    type: 'initial',
    payload: {
      userEntered: null,
      errors: null,
    },
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const [scope, animate] = useAnimate<HTMLFormElement>();

  useEffect(() => {
    if (state.type === 'initial' || !state.payload.isSuccess) return;
    toast.success('Login successfully!');
    const callbackUrl =
      searchParams.get('callbackUrl') ?? ROUTES.staff.nested.dashboard.href;
    router.replace(callbackUrl);
  }, [router, searchParams, state]);

  useEffect(() => {
    if (!state.payload.errors) return;
    toast.error('An error has occurred while trying to login!');

    const elements = scope.current?.querySelectorAll('input.error');
    if (!elements || elements.length === 0) return;
    animate(
      elements,
      {
        x: [-10, 5, 0, 5, 10, 5, 0],
      },
      { type: 'keyframes', delay: stagger(0.3) }
    );
  }, [animate, scope, state]);

  return (
    <Form ref={scope} action={dispatch} className='grid gap-8'>
      <FormRow
        kind='input'
        id='email'
        type='email'
        name='email'
        placeholder='m@example.com'
        autoComplete='email webauthn'
        error={state.payload.errors?.email?.at(0)}
        defaultValue={state.payload.userEntered?.email}
        disabled={isPending}
        labelText='Email'
        labelClassname='min-w-18'
      />

      <FormRow
        kind='input'
        id='password'
        type='password'
        name='password'
        disabled={isPending}
        labelText='Password'
        labelClassname='min-w-18'
        error={state.payload.errors?.password?.at(0)}
      />

      <Button
        type='submit'
        variant='secondary'
        disabled={isPending}
        className='w-full'
      >
        Login
      </Button>
      {state.payload.errors?.unexpected ? (
        <p className='text-red-500'>{state.payload.errors.unexpected}</p>
      ) : null}
    </Form>
  );
}
