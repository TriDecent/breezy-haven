'use client';

import { ROUTES } from '@/shared';

import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { deleteBooking } from './deleteBookingAction';

const styles =
  'group text-primary-300 border-primary-800 hover:bg-accent-600 hover:text-primary-900 flex flex-1 items-center justify-center gap-2 px-4 py-6 text-xs font-bold uppercase transition-colors ';

export default function Modification({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    toast('Are you sure that you want to delete this reservation?', {
      action: {
        label: 'Yes',
        onClick: () => {
          startTransition(async () =>
            toast
              .promise(deleteBooking(id), {
                loading: 'Deleting...',
                success: 'Deleted!',
                error: 'Delete failed!',
              })
              .unwrap()
          );
        },
      },
    });
  };

  return (
    <div className='border-primary-800 flex border-t md:flex-col md:border-t md:border-l'>
      <Link
        href={`${ROUTES.account.nested.reservations.href}/edit/${id}`}
        className={`${styles} md:border-b`}
      >
        <PencilSquareIcon className='text-primary-600 group-hover:text-primary-800 h-5 w-5 transition-colors' />
        <span className='mt-1'>Edit</span>
      </Link>
      {!isPending ? (
        <button onClick={handleDelete} disabled={isPending} className={styles}>
          <TrashIcon className='text-primary-600 group-hover:text-primary-800 h-5 w-5 transition-colors' />
          <span className='mt-1'>Delete</span>
        </button>
      ) : (
        <div className={styles}>
          <Spinner />
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <div
      className='border-primary-300 border-t-accent-600 mx-auto h-8 w-8 animate-spin rounded-full border-2'
      aria-label='Loading'
    ></div>
  );
}
