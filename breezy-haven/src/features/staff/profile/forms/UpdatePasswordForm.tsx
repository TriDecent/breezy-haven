'use client';
import { Form, FormRow } from '@/shared/components';
import { SaveIcon } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';
import {
  updatePasswordAction,
  type UpdatePasswordResponse,
} from '../actions/update-password-action';

export function UpdatePasswordForm() {
  const handleFormSuccess = useCallback(
    () => toast.success('Update password successfully'),
    []
  );

  const handleFormError = useCallback(
    () => toast.error('Update password failed'),
    []
  );

  const handleRenderFields = useCallback(
    (state: UpdatePasswordResponse, isPending: boolean) => (
      <>
        <FormRow
          kind='input'
          id='password'
          name='password'
          labelText='Password'
          type='password'
          autoComplete='new-password webauthn'
          labelClassname='min-w-36'
          defaultValue={state.payload.userEntered?.password}
          error={state.payload.errors?.password?.at(0)}
          disabled={isPending}
        />

        <FormRow
          kind='input'
          id='confirmedPassword'
          name='confirmedPassword'
          labelText='Confirm password'
          type='password'
          labelClassname='min-w-36'
          defaultValue={state.payload.userEntered?.confirmedPassword}
          error={state.payload.errors?.confirmedPassword?.at(0)}
          disabled={isPending}
        />
      </>
    ),
    []
  );

  const handleRenderUnexpectedErrors = useCallback(
    (state: UpdatePasswordResponse) =>
      state.payload.errors?.unexpected ? (
        <p className='text-red-500'>{state.payload.errors.unexpected}</p>
      ) : null,
    []
  );

  return (
    <Form
      action={updatePasswordAction}
      onFormSuccess={handleFormSuccess}
      onFormError={handleFormError}
      renderUnexpectedErrors={handleRenderUnexpectedErrors}
      renderFields={handleRenderFields}
      initialState={{
        type: 'initial',
        payload: { userEntered: null, errors: null },
      }}
      submitNode={
        <>
          <SaveIcon />
          Save changes
        </>
      }
    />
  );
}
