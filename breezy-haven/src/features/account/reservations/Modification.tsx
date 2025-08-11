'use client';

import { ROUTES } from '@/shared';

import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import { deleteBooking } from './deleteBookingAction';

export default function Modification({ id }: { id: number }) {
  const styles =
    'group text-primary-300 border-primary-800 hover:bg-accent-600 hover:text-primary-900 flex flex-1 items-center justify-center gap-2 px-4 py-6 text-xs font-bold uppercase transition-colors ';

  return (
    <div className='border-primary-800 flex border-t md:flex-col md:border-t md:border-l'>
      <input type='hidden' value={id} name='bookingId' />
      <a
        href={`${ROUTES.account.nested.reservations.href}/edit/${id}`}
        className={`${styles} md:border-b`}
      >
        <PencilSquareIcon className='text-primary-600 group-hover:text-primary-800 h-5 w-5 transition-colors' />
        <span className='mt-1'>Edit</span>
      </a>
      <button
        onClick={() => {
          deleteBooking(id);
        }}
        className={styles}
      >
        <TrashIcon className='text-primary-600 group-hover:text-primary-800 h-5 w-5 transition-colors' />
        <span className='mt-1'>Delete</span>
      </button>
    </div>
  );
}
