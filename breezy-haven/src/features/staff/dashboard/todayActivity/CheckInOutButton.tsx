'use client';
import {
  checkinAction,
  checkoutAction,
} from '@/features/staff/bookings/[bookingId]';
import { Button } from '@/shared/components';
import type { Booking } from '@/shared/schemas';
import { useCallback, type ReactNode } from 'react';
import { toast } from 'sonner';

export function CheckInOutButton({
  bookingId,
  mode,
  children,
  className,
}: {
  bookingId: Booking['id'];
  mode: 'checkin' | 'checkout';
  children: ReactNode;
  className: string;
}) {
  const handleAction = useCallback(
    () =>
      toast.warning('Confirm your action', {
        action: {
          label: 'Yes',
          onClick: () => {
            // onSomethingClickedHere
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
          },
        },
      }),
    [bookingId, mode]
  );

  return (
    <Button onClick={handleAction} variant='gradient' className={className}>
      {children}
    </Button>
  );
}
