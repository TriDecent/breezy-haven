'use client';

import { Button, CardAction, FormRow } from '@/shared/components';
import type { Setting } from '@/shared/schemas';
import { useActionState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import {
  updateSettingAction,
  type UpdateSettingResponse,
} from './update-setting-action';

export function SettingForm({ defaultSetting }: { defaultSetting: Setting }) {
  const { state, dispatch, isPending } = useFormState();

  usePendingNotification(isPending);

  return (
    <form action={dispatch} className='flex flex-col gap-y-4'>
      <input type='hidden' name='id' value={defaultSetting.id} />
      <FormRow
        kind='input'
        id='maxBookingLength'
        name='maxBookingLength'
        labelText='Max nights per booking'
        defaultValue={
          state.userEntered?.maxBookingLength ?? defaultSetting.maxBookingLength
        }
        error={state.errors?.maxBookingLength?.at(0)}
        labelClassname='min-w-48'
        autoComplete='off'
        className='max-w-2xs'
      />
      <FormRow
        kind='input'
        id='minBookingLength'
        name='minBookingLength'
        labelText='Min nights per booking'
        defaultValue={
          state.userEntered?.minBookingLength ?? defaultSetting.minBookingLength
        }
        error={state.errors?.minBookingLength?.at(0)}
        labelClassname='min-w-48'
        autoComplete='off'
        className='max-w-2xs'
      />
      <FormRow
        kind='input'
        id='maxGuestPerBooking'
        name='maxGuestPerBooking'
        labelText='Max guests per booking'
        defaultValue={
          state.userEntered?.maxGuestPerBooking ??
          defaultSetting.maxGuestPerBooking
        }
        error={state.errors?.maxGuestPerBooking?.at(0)}
        labelClassname='min-w-48'
        autoComplete='off'
        className='max-w-2xs'
      />
      <FormRow
        kind='input'
        id='breakfastPrice'
        name='breakfastPrice'
        labelText='Breakfast price'
        defaultValue={
          state.userEntered?.breakfastPrice ?? defaultSetting.breakfastPrice
        }
        error={state.errors?.breakfastPrice?.at(0)}
        labelClassname='min-w-48'
        autoComplete='off'
        className='max-w-2xs'
      />
      <CardAction className='self-center md:self-end'>
        <Button
          type='submit'
          variant='outline'
          disabled={isPending}
          className='hover:cursor-pointer'
        >
          Update
        </Button>
        {state.errors?.unexpected ? (
          <p className='text-red-500'>{state.errors.unexpected}</p>
        ) : null}
      </CardAction>
    </form>
  );
}

const useFormState = () => {
  const [state, dispatch, isPending] = useActionState<
    UpdateSettingResponse,
    FormData
  >(updateSettingAction, {
    userEntered: null,
    errors: null,
  });

  useEffect(() => {
    if (state.errors) {
      toast.error('An error has occurred!.');
      return;
    }

    if (state.isSuccess) {
      toast.success('Update settings successfully!');
      return;
    }
  }, [state]);

  return {
    state,
    dispatch,
    isPending,
  };
};

const usePendingNotification = (isPending: boolean) => {
  const toastIdRef = useRef<string | number | undefined>(undefined);

  useEffect(() => {
    if (isPending) {
      toastIdRef.current = toast.loading('Updating settings...');
      return;
    }

    if (!isPending) {
      toast.dismiss(toastIdRef.current);
      return;
    }
  }, [isPending]);
};
