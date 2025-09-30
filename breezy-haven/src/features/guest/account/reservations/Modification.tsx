'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  MiniSpinner,
} from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { deleteBookingAction } from './delete-booking-action';

const styles =
  'group text-primary-300 border-primary-800 hover:bg-accent-600 hover:text-primary-900 flex flex-1 items-center justify-center gap-2 px-4 py-6 text-xs font-bold uppercase transition-colors ';

export default function Modification({
  id,
  onDelete,
}: {
  id: number;
  onDelete: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    toast.warning('Are you sure that you want to delete this reservation?', {
      description: 'This action cannot be undone',
      action: {
        label: 'Yes',

        onClick: () => {
          startTransition(async () => {
            onDelete();
            await toast
              .promise(deleteBookingAction(id), {
                loading: 'Deleting...',
                success: 'Deleted!',
                error: 'Delete failed!',
              })
              .unwrap();
          });
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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button disabled={isPending} className={styles}>
              <TrashIcon className='text-primary-600 group-hover:text-primary-800 h-5 w-5 transition-colors' />
              <span className='mt-1'>Delete</span>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                reservation and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Yes</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <div className={styles}>
          <MiniSpinner />
        </div>
      )}
    </div>
  );
}
