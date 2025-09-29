'use client';
import {
  checkinAction,
  checkoutAction,
} from '@/features/staff/bookings/[bookingId]';
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
} from '@/shared/components';
import type { Booking } from '@/shared/schemas';
import { useCallback, useTransition, type ReactNode } from 'react';
import { toast } from 'sonner';

export function CheckInOutButton({
  bookingId,
  mode,
  children,
  onClickedAction,
  className,
}: {
  bookingId: Booking['id'];
  mode: 'checkin' | 'checkout';
  children: ReactNode;
  onClickedAction: () => void;
  className: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleAction = useCallback(
    (hasBreakFast: boolean) =>
      toast.warning('Confirm your action', {
        action: {
          label: 'Yes',
          onClick: () =>
            startTransition(() => {
              onClickedAction();

              // ? Without `await`, React can still track `isPending` (IdkW)
              // ? Normally, without `await`, `isPending` returns false immediately
              toast.promise(
                mode === 'checkin'
                  ? checkinAction(bookingId, hasBreakFast)
                  : checkoutAction(bookingId),
                {
                  loading: 'Processing...',
                  error: 'An error has occurred!',
                  success: 'Process successfully!',
                }
              );
            }),
        },
      }),
    [bookingId, mode, onClickedAction]
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='gradient' className={className} disabled={isPending}>
          {children}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {mode === 'checkin'
              ? 'Do you want to add breakfast for the guest?'
              : 'Confirm checkout'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {mode === 'checkin'
              ? 'This will check in the guest. You can optionally add breakfast which will be added to the total cost.'
              : 'This will check out the guest and finalize their stay.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {mode === 'checkin' ? (
            <>
              <AlertDialogAction onClick={() => handleAction(false)}>
                No Breakfast
              </AlertDialogAction>
              <AlertDialogAction onClick={() => handleAction(true)}>
                Add Breakfast
              </AlertDialogAction>
            </>
          ) : (
            <AlertDialogAction onClick={() => handleAction(false)}>
              Confirm Checkout
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
