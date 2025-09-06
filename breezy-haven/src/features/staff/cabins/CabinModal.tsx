'use client';
import {
  cabinFormActions,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Modal,
  type ModalHandle,
  type RootState,
} from '@/shared';
import { SquarePenIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { CabinForm } from './CabinForm';
import { addCabinAction } from './actions/addCabinAction';
import { updateCabinAction } from './actions/updateCabinAction';

const PROMPTS = {
  add: {
    title: 'Add a cabin',
    description: 'Fill out the form below to add a new cabin to the list.',
    action: addCabinAction,
  },
  update: {
    title: 'Update the cabin',
    description: 'Modify the details below to update the selected cabin.',
    action: updateCabinAction,
  },
  unknown: {
    title: 'Unknown',
    description: 'Unknown',
  },
} as const;

export const CabinModal = () => {
  const state = useSelector(
    (state: RootState) => state.cabinForm,
    shallowEqual
  );
  const modalRef = useRef<ModalHandle>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!state.isOpen) return;
    modalRef.current?.open();
  }, [state.isOpen]);

  return (
    <Modal
      ref={modalRef}
      onClose={() => dispatch(cabinFormActions.closeForm())}
    >
      {state.mode !== 'unknown' ? (
        <Card>
          <CardHeader>
            <CardTitle>
              <p className='flex items-center gap-4'>
                <SquarePenIcon />
                <span>{PROMPTS[state.mode].title}</span>
              </p>
            </CardTitle>
            <CardDescription>{PROMPTS[state.mode].description}</CardDescription>
          </CardHeader>
          <CardContent>
            <CabinForm action={PROMPTS[state.mode].action} />
          </CardContent>
        </Card>
      ) : null}
    </Modal>
  );
};
