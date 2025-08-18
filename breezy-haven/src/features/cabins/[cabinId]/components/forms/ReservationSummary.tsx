'use client';
import type { DTOCabin, DTOSetting, NonNullableObject } from '@/repositories';
import {
  dateHelper,
  DateSelector,
  fromDateRangeToISO,
  fromISOToDateRange,
  RootState,
  uiActions,
} from '@/shared';

import { differenceInDays, parseISO } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { useDispatch, useSelector } from 'react-redux';

export default function ReservationSummary({
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
  const totalPrice = nightCount * (cabin.regularPrice - cabin.discount);

  const handleSelectDate = (updatedDateRange: DateRange) => {
    if (
      !updatedDateRange ||
      !dateHelper.isDateRangeValid(updatedDateRange, alreadyBookedDates)
    ) {
      dispatch(uiActions.updateDateRange(undefined));
      return;
    }

    dispatch(uiActions.updateDateRange(fromDateRangeToISO(updatedDateRange)));
  };

  return (
    <div className='flex flex-col justify-between space-y-4 sm:w-full lg:flex-1/2'>
      <PriceSummary
        discount={cabin.discount}
        regularPrice={cabin.regularPrice}
        nightCount={nightCount}
        totalPrice={totalPrice}
      />

      <DateSelector
        mode='range'
        selected={
          isoDateRange
            ? fromISOToDateRange(isoDateRange)
            : { from: undefined, to: undefined }
        }
        onSelect={handleSelectDate}
        numberOfMonths={2}
        min={setting.minBookingLength}
        max={setting.maxBookingLength}
        disabled={[{ before: new Date() }, ...alreadyBookedDates]}
        description={`Your stay must be between ${setting.minBookingLength} and ${setting.maxBookingLength} nights. Grayed-out dates are either already booked or in the past.`}
        required
      />
    </div>
  );
}

function PriceSummary({
  discount,
  regularPrice,
  nightCount,
  totalPrice,
}: Record<'discount' | 'regularPrice' | 'nightCount' | 'totalPrice', number>) {
  return (
    <div className='bg-accent-500 text-primary-800 flex min-h-11 items-center justify-evenly gap-2 rounded shadow-sm shadow-black md:gap-6 md:px-4 lg:px-8'>
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
      {nightCount ? (
        <>
          <p className='bg-accent-600 px-3 py-2 text-xl sm:text-2xl'>
            <span>&times;</span> <span>{nightCount}</span>
          </p>
          <p>
            <span className='font-bold uppercase sm:text-lg'>Total</span>{' '}
            <span className='font-semibold sm:text-2xl'>${totalPrice}</span>
          </p>
        </>
      ) : null}
    </div>
  );
}
