'use client';

import { UserRoundCheck } from 'lucide-react';
import {
  use,
  useState,
  useTransition,
  type ComponentProps,
  type ReactNode,
} from 'react';
import { toast } from 'sonner';

import { Button, Checkbox } from '@/shared/components';
import { formatter } from '@/shared/utils';
import { checkinAction } from './checkinAction';
import { BookingContext } from './context/BookingContext';

export function Checkin() {
  const booking = use(BookingContext);
  const [isPending, startTransition] = useTransition();
  const [shouldTriggerConfirmedError, setShouldTriggerConfirmedError] =
    useState(false);
  const [shouldAddBreakfast, setShouldAddBreakfast] = useState(
    booking?.hasBreakfast
  );

  if (!booking) return null;

  return (
    <form
      action={formData => {
        if (!formData.has('confirmation')) {
          setShouldTriggerConfirmedError(true);
          return;
        }

        setShouldTriggerConfirmedError(false);

        startTransition(() =>
          toast
            .promise(
              () => checkinAction(booking.id, formData.has('breakfast')),
              {
                loading: 'Check-in is in progress',
                error: 'Check-in failed',
                success: 'Check-in successfully',
              }
            )
            .unwrap()
        );
      }}
      className='space-y-8'
    >
      <Confirmation
        name='breakfast'
        checked={shouldAddBreakfast}
        onCheckedChange={() => setShouldAddBreakfast(state => !state)}
      >
        <span className='text-muted-foreground'>
          Do you want to add breakfast for
        </span>
        <span className='text-emerald-500'>
          {formatter.formatPrice(booking.setting.breakfastPrice)}
        </span>
      </Confirmation>

      <Confirmation
        name='confirmation'
        error={
          shouldTriggerConfirmedError
            ? 'This action must be confirmed before submitting'
            : ''
        }
      >
        <span className='text-muted-foreground'>
          I confirm that{' '}
          <span className='text-foreground italic'>
            {booking.guest.fullName}
          </span>{' '}
          has paid the total amount of{' '}
        </span>
        <span className='text-emerald-500'>
          {shouldAddBreakfast ? (
            <span>
              {formatter.formatPrice(
                booking.totalPrice +
                  booking.numNights * booking.setting.breakfastPrice
              )}{' '}
              <span className='text-muted-foreground'>
                ({formatter.formatPrice(booking.totalPrice)} +
                {formatter.formatPrice(booking.setting.breakfastPrice)} x{' '}
                {booking.numNights} day{booking.numNights > 1 ? 's' : ''})
              </span>
            </span>
          ) : (
            `${formatter.formatPrice(booking.totalPrice)}`
          )}
        </span>
      </Confirmation>

      <Button
        type='submit'
        disabled={isPending}
        variant='secondary'
        className='w-full'
      >
        <UserRoundCheck />
        <span>Check in</span>
      </Button>
    </form>
  );
}

function Confirmation({
  children,
  error,
  ...props
}: {
  children?: ReactNode;
  error?: string;
} & ComponentProps<typeof Checkbox>) {
  return (
    <div>
      <label className='flex items-center gap-2'>
        <Checkbox {...props} />
        {children}
      </label>
      {error ? <p className='text-red-500'>{error}</p> : null}
    </div>
  );
}
