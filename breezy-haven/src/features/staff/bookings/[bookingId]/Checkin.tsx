'use client';
import { Button, type Booking } from '@/shared';
import { UserRoundCheck } from 'lucide-react';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { updateCheckinAsync } from './updateCheckin';

export function Checkin({
  bookingId,
  isAlreadyCheckedIn,
}: {
  bookingId: Booking['id'];
  isAlreadyCheckedIn: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return !isAlreadyCheckedIn ? (
    <div className='mt-8 flex justify-end'>
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
        className='w-full py-4 md:w-fit'
      >
        <UserRoundCheck />
        <span>Check in</span>
      </Button>
    </div>
  ) : null;
}
