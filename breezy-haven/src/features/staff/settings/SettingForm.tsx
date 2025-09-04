'use client';
import { Button, CardAction, FormRow, type Setting } from '@/shared';

export function SettingForm({ defaultSetting }: { defaultSetting: Setting }) {
  return (
    <form action={() => {}} className='flex flex-col gap-y-4'>
      <FormRow
        type='input'
        id='maxBookingLength'
        name='maxBookingLength'
        labelText='Max nights per booking'
        error=''
        defaultValue={defaultSetting.maxBookingLength}
        labelClassname='min-w-48'
        className='max-w-2xs'
      />
      <FormRow
        type='input'
        id='minBookingLength'
        name='minBookingLength'
        labelText='Min nights per booking'
        error=''
        defaultValue={defaultSetting.minBookingLength}
        labelClassname='min-w-48'
        className='max-w-2xs'
      />
      <FormRow
        type='input'
        id='maxGuestPerBooking'
        name='maxGuestPerBooking'
        labelText='Max guests per booking'
        error=''
        defaultValue={defaultSetting.maxGuestPerBooking}
        labelClassname='min-w-48'
        className='max-w-2xs'
      />
      <FormRow
        type='input'
        id='breakfastPrice'
        name='breakfastPrice'
        labelText='Breakfast price'
        error=''
        defaultValue={defaultSetting.breakfastPrice}
        labelClassname='min-w-48'
        className='max-w-2xs'
      />
      <CardAction className='self-center md:self-end'>
        <Button
          type='submit'
          variant='outline'
          className='hover:cursor-pointer'
        >
          Update
        </Button>
      </CardAction>
    </form>
  );
}
