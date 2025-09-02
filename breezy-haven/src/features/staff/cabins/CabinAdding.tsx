'use client';
import { Button, cabinFormActions } from '@/shared';
import { SquarePenIcon } from 'lucide-react';
import { useDispatch } from 'react-redux';

export function CabinAdding() {
  const dispatch = useDispatch();

  return (
    <>
      <div className='mb-4 flex flex-col'>
        <Button
          className='self-end bg-green-500 text-white'
          onClick={() => dispatch(cabinFormActions.openAddForm())}
        >
          <SquarePenIcon />
          Add new cabin
        </Button>
      </div>
    </>
  );
}
