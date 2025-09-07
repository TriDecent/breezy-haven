'use client';
import { Button, cabinFormActions } from '@/shared';
import { SquarePenIcon } from 'lucide-react';
import Form from 'next/form';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Operations, type Query } from './Operations';

export function CabinOperations() {
  const dispatch = useDispatch();
  const [query, setQuery] = useState<Query>('all');
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get('query')?.toLowerCase().trim();
  const urlQuery = Operations.some(operation => operation[0] === currentQuery)
    ? currentQuery
    : 'all';

  return (
    <>
      <div className='mb-4 flex flex-col items-end justify-end gap-4 md:flex-row'>
        <div className='order-2 overflow-hidden rounded-md md:order-none'>
          <Form action=''>
            <input type='hidden' name='query' value={query} />
            {Operations.map(operation => (
              <Button
                key={operation[0]}
                variant='outline'
                onClick={() => setQuery(operation[0])}
                className={`rounded-none border-none ${urlQuery === operation[0] ? 'bg-border dark:bg-accent' : ''}`}
              >
                {operation[1]}
              </Button>
            ))}
          </Form>
        </div>

        <Button
          className='w-fit justify-self-end bg-green-500 text-white select-none'
          onClick={() => dispatch(cabinFormActions.openAddForm())}
        >
          <SquarePenIcon />
          Add new cabin
        </Button>
      </div>
    </>
  );
}
