'use client';
import { Button, CardAction, Input, ScrollArea, Textarea } from '@/shared';
import { CirclePlus } from 'lucide-react';
import {
  useActionState,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { addCabinAction } from './addCabinAction';

export function AddCabinForm({ onCancel }: { onCancel: () => void }) {
  const [state, action, isPending] = useActionState(addCabinAction, {
    userEntered: null,
    error: null,
  });

  return (
    <form action={action} className='space-y-4'>
      <ScrollArea className='h-96 px-4' type='always'>
        <div className='space-y-4 md:space-y-8'>
          <InputField
            id='name'
            name='name'
            labelText='Name'
            placeholder='Enter the cabin name...'
            defaultValue={state.userEntered?.name ?? ''}
            error={state.error?.name?.[0] ?? ''}
            autoComplete='off'
          />
          <InputField
            id='maxCapacity'
            name='maxCapacity'
            labelText='Max Capacity'
            placeholder='Enter max capacity...'
            defaultValue={state.userEntered?.maxCapacity ?? ''}
            error={state.error?.maxCapacity?.[0] ?? ''}
            autoComplete='off'
          />
          <InputField
            id='regularPrice'
            name='regularPrice'
            labelText='Price'
            placeholder='Enter regular price...'
            defaultValue={state.userEntered?.regularPrice ?? ''}
            error={state.error?.regularPrice?.[0] ?? ''}
            autoComplete='off'
          />
          <InputField
            id='discount'
            name='discount'
            labelText='Discount'
            placeholder='Enter discount...'
            defaultValue={state.userEntered?.discount ?? 0}
            error={state.error?.discount?.[0] ?? ''}
            autoComplete='off'
          />
          <TextareaField
            id='description'
            name='description'
            labelText='Description'
            placeholder='Enter description...'
            defaultValue={state.userEntered?.description ?? ''}
            error={state.error?.description?.[0] ?? ''}
            autoComplete='off'
          />

          <InputField
            id='image'
            name='image'
            labelText='Image'
            placeholder='Enter image URL...'
            defaultValue={state.userEntered?.image ?? ''}
            error={state.error?.image?.[0] ?? ''}
            autoComplete='off'
          />
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
          onClick={onCancel}
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
      {error ? <p className='text-red-500 flex-1'>{error}</p> : null}
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
      {error ? <p className='text-red-500 flex-1'>{error}</p> : null}
    </div>
  );
}
