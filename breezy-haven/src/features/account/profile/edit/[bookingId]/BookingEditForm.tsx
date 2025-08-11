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
} from '@/shared';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

import { useState } from 'react';
import type { DateRange } from 'react-day-picker';

export default function BookingEditForm({
  cabin,
}: {
  cabin: {
    maxCapacity: number;
  };
}) {
  return (
    <article className='shadow md:order-2'>
      <form className='bg-primary-900 flex flex-col gap-5 rounded-lg px-4 py-5 text-lg sm:px-8 lg:py-10 xl:px-16'>
        <div className='flex flex-col gap-4 md:flex-row'>
          <GuestCountInput maxGuestCount={cabin.maxCapacity} />
          <StayingInput />
        </div>

        <NoteInput />

        <PrimaryButton className='self-center md:w-fit'>
          Reserve now
        </PrimaryButton>
      </form>
    </article>
  );
}

function GuestCountInput({ maxGuestCount }: { maxGuestCount: number }) {
  const [guestCount, setGuestCount] = useState<number>(0);

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
          {Array.from({ length: maxGuestCount }, (_, i) => i + 1).map(x => (
            <SelectItem key={x} value={`${x}`}>
              {x} {x === 1 ? 'guest' : 'guests'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function StayingInput() {
  const [range, setRange] = useState<DateRange | undefined>(undefined);

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
              name='dateRange'
              value={JSON.stringify(range)}
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
        </PopoverContent>
      </Popover>
    </div>
  );
}

function NoteInput() {
  return (
    <div className='space-y-3'>
      <label htmlFor='observations' className='block'>
        Anything we should know about your stay?
      </label>
      <Textarea
        name='observations'
        id='observations'
        placeholder='Any pets, allergies, special requirements, etc.?'
      />
    </div>
  );
}
