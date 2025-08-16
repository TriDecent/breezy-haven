'use client';
import type { DTOCabin, DTOSetting, NonNullableObject } from '@/repositories';
import {
  DateSelector,
  fromDateRangeToISO,
  fromISOToDateRange,
  RootState,
  uiActions,
} from '@/shared';

import { differenceInDays, parseISO } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { useDispatch, useSelector } from 'react-redux';

export default function ReservationDateRangeSelector({
  setting,
  alreadyBookedDates,
  cabin,
}: {
  setting: NonNullableObject<DTOSetting>;
  alreadyBookedDates: readonly Date[];
  cabin: NonNullableObject<DTOCabin>;
}) {
  const isoDateRange = useSelector((state: RootState) => state.ui.isoDateRange);
  const dispatch = useDispatch();

  const nightCount = Math.abs(
    differenceInDays(
      parseISO(isoDateRange?.from ?? ''),
      parseISO(isoDateRange?.to ?? '')
    )
  );
  const cabinPrice = nightCount * (cabin.regularPrice - cabin.discount);

  return (
    <div className='flex flex-col justify-between space-y-4 sm:w-full lg:flex-1/2'>
      <div className='bg-accent-500 text-primary-800 flex items-baseline justify-evenly gap-2 rounded shadow-sm shadow-black md:gap-6 md:px-4 lg:px-8'>
        <p className='flex items-center gap-2'>
          {cabin.discount > 0 ? (
            <>
              <span className='text-xl sm:text-2xl'>
                ${cabin.regularPrice - cabin.discount}
              </span>
              <span className='text-primary-700 font-semibold line-through'>
                ${cabin.regularPrice}
              </span>
            </>
          ) : (
            <span className='sm:text-2xl'>${cabin.regularPrice}</span>
          )}
          <span>/night</span>
        </p>
        {nightCount ? (
          <>
            <p className='bg-accent-600 px-3 py-2 text-xl sm:text-2xl'>
              <span>&times;</span> <span>{nightCount}</span>
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
        selected={
          isoDateRange ? fromISOToDateRange(isoDateRange) : isoDateRange
        }
        onSelect={updatedDateRange => {
          if (
            updatedDateRange &&
            isDateRangeValid(updatedDateRange, alreadyBookedDates)
          ) {
            dispatch(
              uiActions.updateDateRange(fromDateRangeToISO(updatedDateRange))
            );
          } else {
            dispatch(uiActions.updateDateRange(undefined));
          }
        }}
        numberOfMonths={2}
        min={setting.minBookingLength}
        max={setting.maxBookingLength}
        disabled={[{ before: new Date() }, ...alreadyBookedDates]}
        description={`Your stay must be between ${setting.minBookingLength} and ${setting.maxBookingLength} nights. Grayed-out dates are either already booked or in the past.`}
      />
    </div>
  );
}

const isDateRangeValid = (
  range: DateRange,
  alreadyBookedDates: readonly Date[]
) => {
  if (!range.from || !range.to) return true;
  const days = [];
  const current = new Date(range.from);
  while (current <= range.to) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days.every(
    day =>
      !alreadyBookedDates.some(d => d.getTime() === day.getTime()) &&
      day >= new Date()
  );
};
