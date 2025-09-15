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
  Button,
  type Booking,
} from '@/shared';
import { toast } from 'sonner';
import { deleteBookingAction } from '../deleteBookingAction';

export function DeleteBookingButton({
  bookingId,
}: {
  bookingId: Booking['id'];
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          onClick={() => {}}
          variant='destructive'
          className='w-full md:w-fit'
        >
          Delete this booking
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            booking.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              toast.warning(
                `Are you sure that you want to delete the booking - ${bookingId}`,
                {
                  description: 'This action cannot be undone',
                  action: {
                    label: 'Yes',
                    onClick: () =>
                      toast.promise(deleteBookingAction(bookingId), {
                        loading: 'Deleting the booking',
                        error: () => `Delete the booking ${bookingId} failed!`,
                        success: `The booking ${bookingId} has been deleted`,
                      }),
                  },
                }
              )
            }
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
