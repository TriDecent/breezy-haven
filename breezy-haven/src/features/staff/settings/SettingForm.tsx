'use client';

import { Form, FormRow } from '@/shared/components';
import type { Setting } from '@/shared/schemas';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import {
  updateSettingAction,
  type UpdateSettingResponse,
} from './update-setting-action';

export function SettingForm({ defaultSetting }: { defaultSetting: Setting }) {
  const [toasterId, setToasterId] = useState<string | number | null>(null);

  const onFormPending = useCallback(() => {
    const currentToasterId = toast.loading('Updating settings...');
    setToasterId(currentToasterId);
  }, []);

  const onFormSuccess = useCallback(() => {
    if (!toasterId) return;
    toast.success('Update settings successfully!');
    toast.dismiss(toasterId);
    setToasterId(null);
  }, [toasterId]);

  const onFormError = useCallback(() => {
    if (!toasterId) return;
    toast.error('An error has occurred!.');
    toast.dismiss(toasterId);
    setToasterId(null);
  }, [toasterId]);

  const renderUnexpectedErrors = useCallback(
    (state: UpdateSettingResponse) =>
      state.payload.errors?.unexpected ? (
        <p className='text-red-500'>{state.payload.errors.unexpected}</p>
      ) : null,
    []
  );

  const renderFields = useCallback(
    (state: UpdateSettingResponse) => (
      <>
        <input type='hidden' name='id' value={defaultSetting.id} />
        <FormRow
          kind='input'
          id='maxBookingLength'
          name='maxBookingLength'
          labelText='Max nights per booking'
          defaultValue={
            state.payload.userEntered?.maxBookingLength ??
            defaultSetting.maxBookingLength
          }
          error={state.payload.errors?.maxBookingLength?.at(0)}
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
            state.payload.userEntered?.minBookingLength ??
            defaultSetting.minBookingLength
          }
          error={state.payload.errors?.minBookingLength?.at(0)}
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
            state.payload.userEntered?.maxGuestPerBooking ??
            defaultSetting.maxGuestPerBooking
          }
          error={state.payload.errors?.maxGuestPerBooking?.at(0)}
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
            state.payload.userEntered?.breakfastPrice ??
            defaultSetting.breakfastPrice
          }
          error={state.payload.errors?.breakfastPrice?.at(0)}
          labelClassname='min-w-48'
          autoComplete='off'
          className='max-w-2xs'
        />
      </>
    ),
    [
      defaultSetting.breakfastPrice,
      defaultSetting.id,
      defaultSetting.maxBookingLength,
      defaultSetting.maxGuestPerBooking,
      defaultSetting.minBookingLength,
    ]
  );

  return (
    <Form
      action={updateSettingAction}
      initialState={{
        type: 'initial',
        payload: {
          userEntered: null,
          errors: null,
        },
      }}
      onFormSuccess={onFormSuccess}
      onFormError={onFormError}
      onFormPending={onFormPending}
      renderUnexpectedErrors={renderUnexpectedErrors}
      renderFields={renderFields}
      submitNode={'Update'}
      className='flex flex-col gap-y-4'
    />
  );
}
