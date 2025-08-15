'use client';

import {
  Button,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
  PrimaryButton,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  type BookingActionResponse,
} from '@/shared';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

import {
  useActionState,
  useEffect,
  useState,
  type TextareaHTMLAttributes,
} from 'react';
import type { DateRange } from 'react-day-picker';
import { toast } from 'sonner';
import { dateHelper } from '../../../../../shared/utils/DateHelper';
import { updateBookingAction } from './updateBookingAction';

export default function BookingEditForm(props: {
  bookingId: number;
  guestCount: number;
  startDate: Date;
  endDate: Date;
  observations: string | null;
  cabin: { maxCapacity: number };
}) {
  const { bookingId, guestCount, startDate, endDate, observations, cabin } =
    props;

  const [state, onSubmit, isPending] = useActionState(updateBookingAction, {
    errors: null,
    userEntered: null,
  });

  useBookingEditToasts(state);

  return (
    <article className='shadow md:order-2'>
      <form
        action={onSubmit}
        className='bg-primary-900 flex flex-col gap-5 rounded-lg px-4 py-5 text-lg sm:px-8 lg:py-10 xl:px-16'
      >
        <input type='hidden' name='bookingId' value={bookingId} />

        <div className='flex flex-col gap-4 md:flex-row'>
          <div className='flex-1'>
            <GuestCountSelect
              defaultValue={guestCount}
              max={cabin.maxCapacity}
            />
            {renderError(state.errors?.guestCount)}
          </div>
          <div className='flex-1'>
            <StayingInput defaultValue={{ from: startDate, to: endDate }} />
            {renderError(state.errors?.date)}
          </div>
        </div>

        <div>
          <NoteInput
            defaultValue={
              state.userEntered?.observations ?? observations ?? undefined
            }
          />
          {renderError(state.errors?.observations)}
        </div>

        <PrimaryButton disabled={isPending} className='self-center md:w-fit'>
          {!isPending ? (
            'Reserve now'
          ) : (
            <div className='border-t-accent-500 border-accent-100 mx-auto h-8 w-8 animate-spin rounded-full border-2'></div>
          )}
        </PrimaryButton>
      </form>
    </article>
  );
}

function useBookingEditToasts(state: BookingActionResponse) {
  useEffect(() => {
    if (state.isActionSuccess)
      toast.success('Your booking information has been updated!');
  }, [state.isActionSuccess]);

  useEffect(() => {
    if (state.errors?.unexpected) toast.error(state.errors.unexpected);
  }, [state.errors?.unexpected]);

  useEffect(() => {
    if (state.errors) toast.error('Update failed due to an error');
  }, [state.errors]);
}

function renderError(error?: string | string[]) {
  return error ? <p className='text-red-500'>{error}</p> : null;
}

function GuestCountSelect({
  defaultValue,
  max,
}: {
  defaultValue: number;
  max: number;
}) {
  const [guestCount, setGuestCount] = useState<number>(defaultValue);

  return (
    <div className='flex-1 space-y-3'>
      <label htmlFor='guestCount' className='block'>
        How many guests
      </label>
      <Select
        name='guestCount'
        value={`${guestCount === 0 ? '' : guestCount}`}
        onValueChange={value => setGuestCount(Number(value))}
      >
        <SelectTrigger id='guestCount' className='w-full'>
          <SelectValue placeholder='Select number of guests' />
        </SelectTrigger>
        <SelectContent align='start'>
          {Array.from({ length: max }, (_, i) => i + 1).map(x => (
            <SelectItem key={x} value={`${x}`}>
              {x} {x === 1 ? 'guest' : 'guests'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function StayingInput({
  defaultValue,
}: {
  defaultValue: DateRange | undefined;
}) {
  const [range, setRange] = useState<DateRange | undefined>(defaultValue);

  return (
    <div className='flex-1 space-y-3'>
      <label htmlFor='dates' className='block'>
        Select your stay
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            id='dates'
            className='w-full justify-between font-normal'
          >
            {range?.from && range?.to
              ? `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
              : 'Select date'}
            <ChevronDownIcon />
            <input
              type='hidden'
              name='startDate'
              value={dateHelper.toISODateOnly(range?.from)}
            />
            <input
              type='hidden'
              name='endDate'
              value={dateHelper.toISODateOnly(range?.to)}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
          <Calendar
            mode='range'
            selected={range}
            disabled={{ before: new Date() }}
            min={2}
            max={20}
            onSelect={setRange}
          />
          <p className='text-foreground p-1 text-xs'>
            Your staying days must be between 2 and 20
          </p>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function NoteInput({ ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className='space-y-3'>
      <label htmlFor='observations' className='block'>
        Anything we should know about your stay?
      </label>
      <Textarea
        name='observations'
        id='observations'
        placeholder='Any pets, allergies, special requirements, etc.?'
        {...props}
      />
    </div>
  );
}
