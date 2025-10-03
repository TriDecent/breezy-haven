'use client';

import {
  Button,
  CardAction,
  Input,
  ScrollArea,
  Textarea,
  Toaster,
} from '@/shared/components';
import { cabinFormActions, type RootState } from '@/shared/store';
import { CirclePlus } from 'lucide-react';
import Image from 'next/image';
import {
  useActionState,
  useEffect,
  useState,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import type {
  ActionResponse,
  SafeAddCabinInput,
  SafeUpdateCabinInput,
} from './actions/types';

export function CabinForm<T extends SafeAddCabinInput | SafeUpdateCabinInput>({
  action,
}: {
  action: (
    currentState: ActionResponse<T>,
    formData: FormData
  ) => Promise<ActionResponse<T>>;
}) {
  const {
    state,
    action: dispatch,
    isPending,
    defaultCabin,
  } = useCabinForm(action);

  const {
    previewImageURL,
    setPreviewImageURL,
    isImageSizeExceeded,
    setIsImageSizeExceeded,
  } = usePreviewImage(defaultCabin?.image ?? null, state);

  return (
    <form
      action={dispatch}
      className='space-y-4'
    >
      <Toaster id='cabin-operation' richColors position='top-right' />
      <ScrollArea className='h-96 px-4' type='always'>
        <div className='space-y-4 md:space-y-8'>
          {defaultCabin?.id ? (
            <input type='hidden' name='id' value={defaultCabin.id} />
          ) : null}
          <InputField
            id='name'
            name='name'
            labelText='Name'
            placeholder='Enter the cabin name...'
            defaultValue={state.userEntered?.name ?? defaultCabin?.name}
            error={state.error?.name?.[0] ?? ''}
            autoComplete='off'
          />
          <InputField
            id='maxCapacity'
            name='maxCapacity'
            labelText='Max Capacity'
            placeholder='Enter max capacity...'
            defaultValue={
              state.userEntered?.maxCapacity ?? defaultCabin?.maxCapacity
            }
            error={state.error?.maxCapacity?.[0] ?? ''}
            autoComplete='off'
          />
          <InputField
            id='regularPrice'
            name='regularPrice'
            labelText='Price'
            placeholder='Enter regular price...'
            defaultValue={
              state.userEntered?.regularPrice ?? defaultCabin?.regularPrice
            }
            error={state.error?.regularPrice?.[0] ?? ''}
            autoComplete='off'
          />
          <InputField
            id='discount'
            name='discount'
            labelText='Discount'
            placeholder='Enter discount...'
            defaultValue={
              state.userEntered?.discount ?? defaultCabin?.discount ?? 0
            }
            error={state.error?.discount?.[0] ?? ''}
            autoComplete='off'
          />
          <TextareaField
            id='description'
            name='description'
            labelText='Description'
            placeholder='Enter description...'
            defaultValue={
              state.userEntered?.description ?? defaultCabin?.description
            }
            error={state.error?.description?.[0] ?? ''}
            autoComplete='off'
          />

          <InputField
            id='image'
            name='image'
            labelText='Image (< 1MB)'
            placeholder='Enter image URL...'
            accept='image/png, image/jpeg, image/webp'
            error={state.error?.image?.[0] ?? ''}
            type='file'
            autoComplete='off'
            onChange={e => {
              const file = e.target.files?.[0];
              if (!file) {
                setPreviewImageURL(null);
                return;
              }

              if (file.size >= 1024 * 1024) {
                e.target.value = '';
                setIsImageSizeExceeded(true);
                return;
              }
              setPreviewImageURL(URL.createObjectURL(file));
              setIsImageSizeExceeded(false);
            }}
          />
          {isImageSizeExceeded ? (
            <p className='text-red-500'>Image size must be less than 1MB.</p>
          ) : null}

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

      <CardAction className='flex items-center gap-4'>
        <Button
          variant='outline'
          className='hover:cursor-pointer'
          disabled={isPending}
        >
          <CirclePlus />
          Add
        </Button>
        <Button
          variant='ghost'
          className='hover:cursor-pointer disabled:cursor-not-allowed'
          type='reset'
          disabled={isPending}
        >
          Cancel
        </Button>
      </CardAction>
      {state.error?.unexpected ? (
        <p className='mt-4 text-center text-red-500'>
          {state.error.unexpected}
        </p>
      ) : null}
    </form>
  );
}

const useCabinForm = <T,>(
  action: (
    currentState: ActionResponse<T>,
    formData: FormData
  ) => Promise<ActionResponse<T>>
) => {
  const defaultCabin = useSelector(
    (state: RootState) => state.cabinForm.defaultCabin
  );
  const dispatch = useDispatch();
  const [formState, formDispatch, isPending] = useActionState<
    ActionResponse<T>,
    FormData
  >(action, {
    userEntered: null,
    error: null,
  });

  const mode = useSelector((state: RootState) => state.cabinForm.mode);

  useEffect(() => {
    if (formState.error)
      toast.error('An error has occurred!', { toasterId: 'cabin-operation' });
    if (formState.success) {
      toast.success('Upload cabin successfully!', {
        toasterId: 'cabin-operation',
      });
      if (mode === 'update' && formState.updatedCabin)
        dispatch(cabinFormActions.openUpdateForm(formState.updatedCabin));
    }
  }, [formDispatch, mode, formState, dispatch]);

  return {
    state: formState,
    action: formDispatch,
    isPending,
    defaultCabin,
  };
};

const usePreviewImage = <T,>(
  defaultImage: string | null,
  state: ActionResponse<T>
) => {
  const mode = useSelector((state: RootState) => state.cabinForm.mode);
  const [isImageSizeExceeded, setIsImageSizeExceeded] = useState(false);
  const [previewImageURL, setPreviewImageURL] = useState<string | null>(
    defaultImage
  );

  useEffect(() => {
    if (!state?.success) return;

    if (mode !== 'update') setPreviewImageURL(null);
  }, [mode, state]);

  return {
    previewImageURL,
    setPreviewImageURL,
    isImageSizeExceeded,

    setIsImageSizeExceeded,
  };
};

function InputField({
  id,
  name,
  labelText,
  error,
  ...props
}: {
  id: string;
  name: string;
  labelText: string;
  error: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className='flex flex-col gap-1 md:flex-row md:items-center md:gap-4'>
      <label htmlFor={id} className='min-w-28'>
        {labelText}
      </label>
      <Input id={id} name={name} {...props} className='flex-2' />
      {error ? <p className='flex-1 text-red-500'>{error}</p> : null}
    </div>
  );
}

function TextareaField({
  id,
  name,
  labelText,
  error,
  ...props
}: {
  id: string;
  name: string;
  labelText: string;
  error: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className='flex flex-col gap-1 md:flex-row md:items-center md:gap-4'>
      <label htmlFor={id} className='min-w-28'>
        {labelText}
      </label>
      <Textarea id={id} name={name} className='flex-2' {...props} />
      {error ? <p className='flex-1 text-red-500'>{error}</p> : null}
    </div>
  );
}
