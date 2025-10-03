'use client';
import type { ActionResponse } from '@/shared/actions';
import { Button, CardAction, FormRow } from '@/shared/components';
import { useShakeError } from '@/shared/hooks/use-shake-errors';
import type { SignUp } from '@/shared/schemas';
import { Pen } from 'lucide-react';
import Form from 'next/form';
import { useActionState, useEffect, type JSX } from 'react';

export type SignupError = Partial<
  Record<keyof SignUp, string[]> & { unexpected?: string }
>;
export type SignupResponse = ActionResponse<Partial<SignUp>, SignupError>;

export function SignupForm<TResponse extends SignupResponse>({
  action,
  initialState,
  renderOtherFieldsAction: renderOtherFields,
  signUpText,
  onSignupSuccessAction: onSignupSuccess,
  onSignupFailedAction: onSignupFailed,
}: {
  action: (state: Awaited<TResponse>, payload: FormData) => Promise<TResponse>;
  initialState: Awaited<TResponse>;
  renderOtherFieldsAction?: (
    state: Awaited<TResponse>,
    isPending: boolean
  ) => JSX.Element;
  signUpText: string;
  onSignupSuccessAction: (state: TResponse) => void;
  onSignupFailedAction: (state: TResponse) => void;
}) {
  const [state, dispatch, isPending] = useActionState<TResponse, FormData>(
    action,
    initialState
  );

  useSignup(state, onSignupSuccess, onSignupFailed);

  const scope = useShakeError(state.errors);

  return (
    <Form ref={scope} action={dispatch} className='flex flex-col gap-6'>
      <FormRow
        id='fullName'
        name='fullName'
        labelText='Full name'
        kind='input'
        type='text'
        disabled={isPending}
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
        disabled={isPending}
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
        disabled={isPending}
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
        disabled={isPending}
        labelClassname='min-w-36'
        defaultValue={state.userEntered?.confirmedPassword}
        error={state.errors?.confirmedPassword?.[0]}
      />

      {renderOtherFields?.(state, isPending)}

      <CardAction className='flex w-full flex-col gap-4 self-end md:w-fit md:flex-row'>
        <Button
          variant='ghost'
          type='reset'
          disabled={isPending}
          className='order-2 md:order-1'
        >
          Cancel
        </Button>
        <Button
          variant='secondary'
          type='submit'
          disabled={isPending}
          className='order-1 md:order-2'
        >
          <Pen /> {signUpText}
        </Button>
      </CardAction>
      {state.errors?.unexpected ? (
        <p className='text-red-500'>{state.errors.unexpected}</p>
      ) : null}
    </Form>
  );
}

const useSignup = <TResponse extends SignupResponse>(
  state: TResponse,
  onSignupSuccess: (state: TResponse) => void,
  onSignupFailed: (state: TResponse) => void
) => {
  useEffect(() => {
    if (!state.isSuccess) return;
    onSignupSuccess(state);
  }, [onSignupSuccess, state]);

  useEffect(() => {
    if (!state.errors) return;
    onSignupFailed(state);
  }, [onSignupFailed, state]);
};
