'use client';
import { DateSelector } from '@/shared';
import { isWithinInterval } from 'date-fns';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

export default function ReservationDateRangeSelector() {
  // CHANGE
  const regularPrice = 23;
  const discount = 23;
  const numNights = 23;
  const cabinPrice = 23;

  // SETTINGS
  const minBookingLength = 1;
  const maxBookingLength = 23;

  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  useEffect(() => {
    console.log(dateRange);
  }, [dateRange]);

  return (
    <div className='flex flex-col justify-between space-y-4 sm:w-full md:order-1 lg:flex-1/2 lg:space-y-0'>
      <DateSelector
        className='my-auto'
        mode='range'
        selected={dateRange}
        onSelect={setDateRange}
        numberOfMonths={2}
        min={2}
        max={20}
        disabled={{ before: new Date(Date.now()) }}
        description='Your stay must be between 2 and 20 nights'
      />

      <div className='bg-accent-500 text-primary-800 mt-auto flex items-baseline justify-evenly gap-2 rounded md:gap-6 md:px-4 lg:px-8'>
        <p className='flex items-center gap-2'>
          {discount > 0 ? (
            <>
              <span className='text-xl sm:text-2xl'>
                ${regularPrice - discount}
              </span>
              <span className='text-primary-700 font-semibold line-through'>
                ${regularPrice}
              </span>
            </>
          ) : (
            <span className='sm:text-2xl'>${regularPrice}</span>
          )}
          <span>/night</span>
        </p>
        {numNights ? (
          <>
            <p className='bg-accent-600 px-3 py-2 text-xl sm:text-2xl'>
              <span>&times;</span> <span>{numNights}</span>
            </p>
            <p>
              <span className='font-bold uppercase sm:text-lg'>Total</span>{' '}
              <span className='font-semibold sm:text-2xl'>${cabinPrice}</span>
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}

function isAlreadyBooked(range: DateRange, datesArr: readonly Date[]): boolean {
  if (!range.from || !range.to) return false;

  return datesArr.some(date =>
    isWithinInterval(date, { start: range.from!, end: range.to! })
  );
}
