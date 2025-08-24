'use client';

import {
  Button,
  Calendar,
  dateHelper,
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
import { updateBookingAction } from './updateBookingAction';

type BookingInfo = {
  bookingId: number;
  guestCount: number;
  startDate: Date;
  endDate: Date;
  observations: string | null;
};

type CabinInfo = {
  maxCapacity: number;
  alreadyBookedDates: readonly Date[];
};

type BookingRules = {
  minBookingDaysCount: number;
  maxBookingDaysCount: number;
};

type BookingEditFormProps = {
  booking: BookingInfo;
  cabin: CabinInfo;
  rules: BookingRules;
};

export default function BookingEditForm({
  booking,
  cabin,
  rules,
}: BookingEditFormProps) {
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
        <input type='hidden' name='bookingId' value={booking.bookingId} />

        <div className='flex flex-col gap-4 md:flex-row'>
          <div className='flex-1'>
            <GuestCountSelect
              defaultValue={booking.guestCount}
              max={cabin.maxCapacity}
            />
            {renderError(state.errors?.guestCount)}
          </div>
          <div className='flex-1'>
            <StayingInput
              defaultValue={{ from: booking.startDate, to: booking.endDate }}
              minBookingDaysCount={rules.minBookingDaysCount}
              maxBookingDaysCount={rules.maxBookingDaysCount}
              alreadyBookedDates={cabin.alreadyBookedDates}
            />
            {renderError(state.errors?.date)}
          </div>
        </div>

        <div>
          <NoteInput
            defaultValue={
              state.userEntered?.observations ??
              booking.observations ??
              undefined
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
    if (state.errors) toast.error('Update failed due to an error');
    if (state.errors?.unexpected) toast.error(state.errors.unexpected);
    if (state.isActionSuccess)
      toast.success('Your booking information has been updated!');
  }, [state]);
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
  minBookingDaysCount,
  maxBookingDaysCount,
  alreadyBookedDates,
}: {
  defaultValue: DateRange | undefined;
  minBookingDaysCount: number;
  maxBookingDaysCount: number;
  alreadyBookedDates: readonly Date[];
}) {
  const [range, setRange] = useState<DateRange | undefined>(defaultValue);

  const handleSelectDate = (updatedDateRange: DateRange) => {
    if (
      !updatedDateRange ||
      !dateHelper.isDateRangeValid(updatedDateRange, alreadyBookedDates)
    ) {
      setRange(undefined);
      return;
    }
    setRange(updatedDateRange);
  };

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
        <PopoverContent className='p-0' align='start'>
          <Calendar
            mode='range'
            selected={range}
            disabled={[{ before: new Date() }, ...alreadyBookedDates]}
            min={minBookingDaysCount}
            max={maxBookingDaysCount}
            onSelect={handleSelectDate}
            required
            className='mx-auto'
          />
          <p className='text-foreground p-1 text-xs text-center'>
            Your staying days must be between ${minBookingDaysCount} and $
            {maxBookingDaysCount}
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
