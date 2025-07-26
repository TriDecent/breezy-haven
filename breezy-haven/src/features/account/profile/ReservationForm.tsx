'use client';
import {
  PrimaryButton,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@/shared';

import { useState } from 'react';

export default function ReservationForm() {
  const [guestCount, setGuestCount] = useState<number>(0);
  // CHANGE
  const maxCapacity = 23;

  return (
    <article className='h-fit shadow-lg md:order-2'>
      <div className='bg-primary-800 text-primary-300 flex items-center justify-between rounded-t-lg px-8 py-4 md:px-16'>
        <p>Logged in as</p>

        {/* <div className='flex gap-4 items-center'>
          <img
            // Important to display google profile images
            referrerPolicy='no-referrer'
            className='h-8 rounded-full'
            src={user.image}
            alt={user.name}
          />
          <p>{user.name}</p>
        </div> */}
      </div>

      <form className='bg-primary-900 flex flex-col gap-5 rounded-b-lg px-4 py-5 text-lg sm:px-8 md:py-10 xl:px-16'>
        <div className='space-y-2'>
          <label htmlFor='guestCount'>How many guests?</label>
          <Select
            name='guestCount'
            value={`${guestCount === 0 ? '' : guestCount}`}
            onValueChange={value => setGuestCount(Number(value))}
          >
            <SelectTrigger id='guestCount' className='w-full'>
              <SelectValue placeholder='Select number of guests' />
            </SelectTrigger>
            <SelectContent align='start'>
              {Array.from({ length: maxCapacity }, (_, i) => i + 1).map(x => (
                <SelectItem key={x} value={`${x}`}>
                  {x} {x === 1 ? 'guest' : 'guests'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <label htmlFor='observations'>
            Anything we should know about your stay?
          </label>
          <Textarea
            name='observations'
            id='observations'
            placeholder='Any pets, allergies, special requirements, etc.?'
          />
        </div>

        <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-end'>
          <div className='w-full lg:order-2'>
            <PrimaryButton>Reserve now</PrimaryButton>
          </div>
          <p className='text-muted-foreground self-center text-base lg:order-1'>
            Start by selecting dates
          </p>
        </div>
      </form>
    </article>
  );
}
