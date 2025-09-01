'use client';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Modal,
} from '@/shared';
import { SquarePenIcon } from 'lucide-react';
import { useState } from 'react';
import { CabinForm } from './CabinForm';
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

      <Modal isOpen={shouldOpenForm} onClose={() => setShouldOpenForm(false)}>
        <Card>
          <CardHeader>
            <CardTitle>
              <p className='flex items-center gap-4'>
                <SquarePenIcon />
                <span>Add a cabin</span>
              </p>
            </CardTitle>
            <CardDescription>
              Fill out the form below to add a new cabin to the list.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CabinForm
              onCancel={() => setShouldOpenForm(false)}
              action={addCabinAction}
            />
          </CardContent>
        </Card>
      </Modal>
    </>
  );
}
