'use client';
import { Cabin, Setting } from '@/repositories';
import { DateSelector } from '@/shared';
import { isWithinInterval } from 'date-fns';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

export default function ReservationDateRangeSelector({
  setting,
  bookedDates,
  cabin,
}: {
  setting: Setting;
  bookedDates: readonly Date[];
  cabin: Cabin;
}) {
  // CHANGE
  const regularPrice = 23;
  const discount = 23;
  const numNights = 23;
  const cabinPrice = 23;

  // SETTINGS
  const { minBookingLength, maxBookingLength } = setting;

  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  useEffect(() => {
    console.log(dateRange);
  }, [dateRange]);

  return (
    <div className='flex flex-col justify-between space-y-4 sm:w-full lg:flex-1/2'>
      <div className='bg-accent-500 text-primary-800 flex items-baseline justify-evenly gap-2 rounded shadow-sm shadow-black md:gap-6 md:px-4 lg:px-8'>
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

      <DateSelector
        mode='range'
        selected={dateRange}
        onSelect={setDateRange}
        numberOfMonths={2}
        min={2}
        max={20}
        disabled={{ before: new Date(Date.now()) }}
        description='Your stay must be between 2 and 20 nights'
      />
    </div>
  );
}

function isAlreadyBooked(range: DateRange, datesArr: readonly Date[]): boolean {
  if (!range.from || !range.to) return false;

  return datesArr.some(date =>
    isWithinInterval(date, { start: range.from!, end: range.to! })
  );
}
