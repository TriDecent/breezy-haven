'use client';

import { Form, FormRow, ScrollArea, Toaster } from '@/shared/components';
import { cabinFormActions, type RootState } from '@/shared/store';
import { CirclePlus } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import type {
  CabinOperationResponse,
  SafeAddCabinInput,
  SafeUpdateCabinInput,
} from './actions/types';

const toasterId = 'cabin-operation';

export function CabinForm<T extends SafeAddCabinInput | SafeUpdateCabinInput>({
  action,
}: {
  action: (
    currentState: CabinOperationResponse<T>,
    formData: FormData
  ) => Promise<CabinOperationResponse<T>>;
}) {
  const defaultCabin = useSelector(
    (state: RootState) => state.cabinForm.defaultCabin
  );
  const mode = useSelector((state: RootState) => state.cabinForm.mode);
  const [previewImageURL, setPreviewImageURL] = useState<string | null>(
    defaultCabin?.image ?? null
  );

  const dispatch = useDispatch();

  const initialState = useMemo(
    () =>
      ({
        type: 'initial',
        payload: {
          userEntered: null,
          errors: null,
        },
      }) as const,
    []
  );

  const renderUnexpectedErrors = useCallback(
    (state: CabinOperationResponse<T>) =>
      state.payload.errors?.unexpected ? (
        <p className='mt-4 text-center text-red-500'>
          {state.payload.errors.unexpected}
        </p>
      ) : null,
    []
  );

  const onFormSuccess = useCallback(
    (state: CabinOperationResponse<T>) => {
      toast.success('Upload cabin successfully!', {
        toasterId,
      });
      if (
        mode === 'update' &&
        state.type === 'success' &&
        state.payload.updatedCabin
      )
        dispatch(cabinFormActions.openUpdateForm(state.payload.updatedCabin));
      setPreviewImageURL(null);
    },
    [dispatch, mode]
  );

  const onFormError = useCallback(
    () => toast.error('An error has occurred!', { toasterId }),
    []
  );

  const renderFields = useCallback(
    (state: CabinOperationResponse<T>) => (
      <>
        <Toaster id={toasterId} richColors position='top-right' />
        <ScrollArea className='h-78 px-4' type='always'>
          <div className='space-y-4 md:space-y-8'>
            {defaultCabin?.id ? (
              <input type='hidden' name='id' value={defaultCabin.id} />
            ) : null}
            <FormRow
              kind='input'
              id='name'
              name='name'
              labelText='Name'
              placeholder='Enter the cabin name...'
              labelClassname='min-w-28'
              defaultValue={
                state.payload.userEntered?.name ?? defaultCabin?.name
              }
              error={state.payload.errors?.name?.[0] ?? ''}
              autoComplete='off'
            />
            <FormRow
              kind='input'
              id='maxCapacity'
              name='maxCapacity'
              labelText='Max Capacity'
              placeholder='Enter max capacity...'
              labelClassname='min-w-28'
              defaultValue={
                state.payload.userEntered?.maxCapacity ??
                defaultCabin?.maxCapacity
              }
              error={state.payload.errors?.maxCapacity?.[0] ?? ''}
              autoComplete='off'
            />
            <FormRow
              kind='input'
              id='regularPrice'
              name='regularPrice'
              labelText='Price'
              placeholder='Enter regular price...'
              labelClassname='min-w-28'
              defaultValue={
                state.payload.userEntered?.regularPrice ??
                defaultCabin?.regularPrice
              }
              error={state.payload.errors?.regularPrice?.[0] ?? ''}
              autoComplete='off'
            />
            <FormRow
              kind='input'
              id='discount'
              name='discount'
              labelText='Discount'
              labelClassname='min-w-28'
              placeholder='Enter discount...'
              defaultValue={
                state.payload.userEntered?.discount ??
                defaultCabin?.discount ??
                0
              }
              error={state.payload.errors?.discount?.[0] ?? ''}
              autoComplete='off'
            />
            <FormRow
              kind='textarea'
              id='description'
              name='description'
              labelText='Description'
              labelClassname='min-w-28'
              placeholder='Enter description...'
              defaultValue={
                state.payload.userEntered?.description ??
                defaultCabin?.description
              }
              error={state.payload.errors?.description?.[0] ?? ''}
              autoComplete='off'
            />

            <FormRow
              kind='input'
              id='image'
              name='image'
              labelText='Image (< 1MB)'
              labelClassname='min-w-28'
              placeholder='Enter image URL...'
              accept='image/png, image/jpeg, image/webp'
              error={state.payload.errors?.image?.[0] ?? ''}
              type='file'
              autoComplete='off'
              onChange={e => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > 1024 * 1024) {
                  e.target.value = '';
                  toast.warning('Image size must not exceed 1MB', {
                    toasterId,
                  });
                  return;
                }
                if (
                  !file.type.startsWith('image/') ||
                  !['image/jpg', 'image/jpeg', 'image/png'].includes(file.type)
                ) {
                  e.target.value = '';
                  toast.warning('Only JPG, PNG and JPEG images are allowed', {
                    toasterId,
                  });
                  return;
                }
                setPreviewImageURL(URL.createObjectURL(file));
              }}
            />

            {previewImageURL ? (
              <Image
                src={previewImageURL ?? defaultCabin?.image}
                alt='Cabin preview'
                width='256'
                height='256'
                style={{ width: 'auto', height: 'auto' }}
                className='ml-auto aspect-video h-36 rounded-lg mask-y-from-75% mask-x-from-95% object-cover'
              />
            ) : null}
          </div>
        </ScrollArea>
      </>
    ),
    [
      defaultCabin?.description,
      defaultCabin?.discount,
      defaultCabin?.id,
      defaultCabin?.image,
      defaultCabin?.maxCapacity,
      defaultCabin?.name,
      defaultCabin?.regularPrice,
      previewImageURL,
    ]
  );

  return (
    <Form
      action={action}
      initialState={initialState}
      renderUnexpectedErrors={renderUnexpectedErrors}
      onFormSuccess={onFormSuccess}
      onFormError={onFormError}
      submitNode={
        <>
          <CirclePlus />
          Add
        </>
      }
      renderFields={renderFields}
    />
  );
}
