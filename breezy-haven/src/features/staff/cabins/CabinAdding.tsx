'use client';
import { Button } from '@/shared';
import { SquarePenIcon } from 'lucide-react';
import { useState } from 'react';
import { CabinFormProvider } from './CabinFormProvider';
import { CabinModal } from './CabinModal';
import { addCabinAction } from './actions/addCabinAction';

export function CabinAdding() {
  const [shouldOpenForm, setShouldOpenForm] = useState(false);

  return (
    <>
      <div className='mb-4 flex flex-col'>
        <Button
          className='self-end bg-green-500 text-white'
          onClick={() => setShouldOpenForm(true)}
        >
          <SquarePenIcon />
          Add new cabin
        </Button>
      </div>

      <CabinFormProvider defaultContext={{ action: addCabinAction }}>
        <CabinModal
          title='Add a cabin'
          description=' Fill out the form below to add a new cabin to the list.'
          shouldOpenForm={shouldOpenForm}
          onClose={() => setShouldOpenForm(false)}
        />
      </CabinFormProvider>
    </>
  );
}
