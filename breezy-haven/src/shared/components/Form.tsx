'use client';
import NextForm from 'next/form';
import { useActionState, useEffect, type JSX, type ReactNode } from 'react';
import type { ActionResponse } from '../actions';
import { Button } from './ui/button';
import { CardAction } from './ui/card';

interface FormProps<T> {
  readonly action: (state: T, formData: FormData) => Promise<T>;
  readonly initialState: Awaited<T>;
  readonly renderFields: (state: Awaited<T>, isPending: boolean) => JSX.Element;
  readonly renderUnexpectedErrors: (state: Awaited<T>) => JSX.Element;
  readonly onFormSuccess: () => void;
  readonly onFormError: () => void;

  readonly submitNode: ReactNode;
}

type FormResponse = ActionResponse<unknown, unknown>;

export function Form<T extends FormResponse>({
  action,
  initialState,
  renderFields,
  renderUnexpectedErrors,
  onFormSuccess,
  onFormError,
  submitNode,
}: FormProps<T>) {
  const [state, dispatch, isPending] = useActionState(action, initialState);
  useForm(state, onFormSuccess, onFormError);

  return (
    <NextForm action={dispatch} className='space-y-6'>
      {renderFields(state, isPending)}

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
          {submitNode}
        </Button>
      </CardAction>

      {renderUnexpectedErrors?.(state)}
    </NextForm>
  );
}

const useForm = <T extends FormResponse>(
  state: Awaited<T>,
  onFormSuccess: () => void,
  onFormFail: () => void
) => {
  useEffect(() => {
    if (!state.isSuccess) return;
    onFormSuccess();
  }, [onFormSuccess, state.isSuccess]);

  useEffect(() => {
    if (!state.errors) return;
    onFormFail();
  }, [onFormFail, state.errors]);
};
