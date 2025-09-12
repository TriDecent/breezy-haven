'use client';
import { Button, type Booking } from '@/shared';
import { UserRoundCheck } from 'lucide-react';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { updateCheckinAsync } from './updateCheckin';

export function Checkin({ bookingId }: { bookingId: Booking['id'] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      onClick={() =>
        startTransition(() =>
          toast
            .promise(() => updateCheckinAsync(bookingId), {
              loading: 'Check-in is in progress',
              error: 'Check-in failed',
              success: 'Check-in successfully',
            })
            .unwrap()
        )
      }
      disabled={isPending}
      variant='secondary'
      className='w-full'
    >
      <UserRoundCheck />
      <span>Check in</span>
    </Button>
  );
}
