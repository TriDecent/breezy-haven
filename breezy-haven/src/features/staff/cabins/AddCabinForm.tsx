'use client';
import { Button, CardAction, Input, ScrollArea } from '@/shared';
import { CirclePlus } from 'lucide-react';
import { useActionState, type InputHTMLAttributes } from 'react';
import { addCabinAction } from './addCabinAction';

export function AddCabinForm({ onCancel }: { onCancel: () => void }) {
  const [state, action, isPending] = useActionState(addCabinAction, {
    userEntered: null,
    error: null,
  });

  return (
    <form action={action} className='space-y-4'>
      <ScrollArea className='h-96 px-4' type='always'>
        <div className='space-y-4'>
          <FormRow
            id='name'
            name='name'
            labelText='Name'
            placeholder='Enter the cabin name...'
            defaultValue={state.userEntered?.name ?? ''}
            error={state.error?.name ?? ''}
          />
          <FormRow
            id='maxCapacity'
            name='maxCapacity'
            labelText='Max Capacity'
            placeholder='Enter max capacity...'
            defaultValue={state.userEntered?.maxCapacity ?? ''}
            error={state.error?.maxCapacity ?? ''}
          />
          <FormRow
            id='regularPrice'
            name='regularPrice'
            labelText='Price'
            placeholder='Enter regular price...'
            defaultValue={state.userEntered?.regularPrice ?? ''}
            error={state.error?.regularPrice ?? ''}
          />
          <FormRow
            id='discount'
            name='discount'
            labelText='Discount'
            placeholder='Enter discount...'
            defaultValue={state.userEntered?.discount ?? ''}
            error={state.error?.discount ?? ''}
          />
          <FormRow
            id='description'
            name='description'
            labelText='Description'
            placeholder='Enter description...'
            defaultValue={state.userEntered?.description ?? ''}
            error={state.error?.description ?? ''}
          />
          <FormRow
            id='image'
            name='image'
            labelText='Image'
            placeholder='Enter image URL...'
            defaultValue={state.userEntered?.image ?? ''}
            error={state.error?.image ?? ''}
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
    </form>
  );
}

function FormRow({
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
    <div className='flex flex-col gap-1'>
      <label htmlFor={id}>{labelText}</label>
      <Input id={id} name={name} {...props} />
      {error ? <p className='text-red-500'>{error}</p> : null}
    </div>
  );
}
