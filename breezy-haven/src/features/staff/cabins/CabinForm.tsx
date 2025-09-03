'use client';
import {
  Button,
  cabinFormActions,
  CardAction,
  Input,
  ScrollArea,
  Textarea,
  Toaster,
  type RootState,
} from '@/shared';
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
  const defaultCabin = useSelector(
    (state: RootState) => state.cabinForm.defaultCabin
  );
  const mode = useSelector((state: RootState) => state.cabinForm.mode);
  const dispatch = useDispatch();
  const [formState, formDispatch, isPending] = useActionState<
    ActionResponse<T>,
    FormData
  >(action, {
    userEntered: null,
    error: null,
  });

  const [previewImageURL, setPreviewImageURL] = useState<string | null>(
    defaultCabin?.image ?? null
  );
  const [doesImageExceed, setDoesImageSizeExceed] = useState(false);

  useEffect(() => {
    if (formState.error)
      toast.error('An error has occurred!', { toasterId: 'cabin-operation' });
    if (formState.success) {
      toast.success('Upload cabin successfully!', {
        toasterId: 'cabin-operation',
      });
      if (mode === 'update' && formState.updatedCabin)
        dispatch(cabinFormActions.openUpdateForm(formState.updatedCabin));
      if (mode !== 'update') setPreviewImageURL(null);
    }
  }, [formDispatch, mode, formState, dispatch]);

  return (
    <form
      action={formData => {
        const image = formData.get('image');

        if (image instanceof File && image.size === 0) formData.delete('image');

        formDispatch(formData);
      }}
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
            defaultValue={formState.userEntered?.name ?? defaultCabin?.name}
            error={formState.error?.name?.[0] ?? ''}
            autoComplete='off'
          />
          <InputField
            id='maxCapacity'
            name='maxCapacity'
            labelText='Max Capacity'
            placeholder='Enter max capacity...'
            defaultValue={
              formState.userEntered?.maxCapacity ?? defaultCabin?.maxCapacity
            }
            error={formState.error?.maxCapacity?.[0] ?? ''}
            autoComplete='off'
          />
          <InputField
            id='regularPrice'
            name='regularPrice'
            labelText='Price'
            placeholder='Enter regular price...'
            defaultValue={
              formState.userEntered?.regularPrice ?? defaultCabin?.regularPrice
            }
            error={formState.error?.regularPrice?.[0] ?? ''}
            autoComplete='off'
          />
          <InputField
            id='discount'
            name='discount'
            labelText='Discount'
            placeholder='Enter discount...'
            defaultValue={
              formState.userEntered?.discount ?? defaultCabin?.discount ?? 0
            }
            error={formState.error?.discount?.[0] ?? ''}
            autoComplete='off'
          />
          <TextareaField
            id='description'
            name='description'
            labelText='Description'
            placeholder='Enter description...'
            defaultValue={
              formState.userEntered?.description ?? defaultCabin?.description
            }
            error={formState.error?.description?.[0] ?? ''}
            autoComplete='off'
          />

          <InputField
            id='image'
            name='image'
            labelText='Image (< 1MB)'
            placeholder='Enter image URL...'
            accept='image/png, image/jpeg, image/webp'
            error={formState.error?.image?.[0] ?? ''}
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
                setDoesImageSizeExceed(true);
                return;
              }
              setPreviewImageURL(URL.createObjectURL(file));
              setDoesImageSizeExceed(false);
            }}
          />
          {doesImageExceed ? (
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
          onClick={() => setPreviewImageURL(null)}
          disabled={isPending}
        >
          Cancel
        </Button>
      </CardAction>
      {formState.error?.unexpected ? (
        <p className='mt-4 text-center text-red-500'>
          {formState.error.unexpected}
        </p>
      ) : null}
    </form>
  );
}

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
