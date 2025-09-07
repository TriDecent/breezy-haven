'use client';
import { Button, cabinFormActions, QueryButton } from '@/shared';
import { SquarePenIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { Operations } from './Operations';

export function CabinOperations() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get('query')?.toLowerCase().trim();
  const urlQuery = Operations.some(operation => operation[0] === currentQuery)
    ? currentQuery
    : 'all';

  return (
    <div className='mb-4 flex flex-col items-end justify-end gap-4 md:flex-row'>
      <div className='order-2 overflow-hidden rounded-md md:order-none'>
        {Operations.map(operation => (
          <QueryButton
            key={operation[0]}
            isActive={urlQuery === operation[0]}
            queries={[{ key: 'query', value: operation[0] }]}
          >
            {operation[1]}
          </QueryButton>
        ))}
      </div>

      <Button
        className='w-fit justify-self-end bg-green-500 text-white select-none'
        onClick={() => dispatch(cabinFormActions.openAddForm())}
      >
        <SquarePenIcon />
        Add new cabin
      </Button>
    </div>
  );
}
