'use client';
import {
  checkinAction,
  checkoutAction,
} from '@/features/staff/bookings/[bookingId]';
import { Button } from '@/shared/components';
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
    () =>
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
                  ? checkinAction(bookingId, false)
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
    <Button
      onClick={handleAction}
      disabled={isPending}
      variant='gradient'
      className={className}
    >
      {children}
    </Button>
  );
}
