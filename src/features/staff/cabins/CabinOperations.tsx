'use client';

import {
  Button,
  ButtonGroup,
  ButtonGroupSeparator,
  DownloadButton,
  QueryButton,
} from '@/shared/components';
import { cabinFormActions } from '@/shared/store';
import { SquarePenIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Fragment } from 'react';
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
      <ButtonGroup className='order-2 overflow-hidden rounded-md shadow md:order-none'>
        {Operations.map((operation, index) => (
          <Fragment key={operation[0]}>
            <QueryButton
              isActive={urlQuery === operation[0]}
              queries={[{ key: 'query', value: operation[0] }]}
            >
              {operation[1]}
            </QueryButton>

            {index !== Operations.length - 1 ? <ButtonGroupSeparator /> : null}
          </Fragment>
        ))}
      </ButtonGroup>

      <div className='flex w-fit flex-col items-center gap-4 justify-self-end lg:flex-row'>
        <Button
          variant='green'
          onClick={() => dispatch(cabinFormActions.openAddForm())}
          className='w-full lg:w-fit'
        >
          <SquarePenIcon />
          Add new cabin
        </Button>

        <DownloadButton
          link='/api/downloads/cabins'
          text={'Download cabins as CSV'}
          className='w-full lg:w-fit'
        />
      </div>
    </div>
  );
}
