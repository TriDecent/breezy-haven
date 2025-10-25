'use cache';
import { unauthBookingService, unauthSettingService } from '@/services';

import type { Cabin } from '@/shared/schemas';
import { errorHelper } from '@/shared/utils';
import ReservationForm from './ReservationForm';
import ReservationSummary from './ReservationSummary';

export default async function Reservation({ cabin }: { cabin: Cabin }) {
  const promises = [
    unauthBookingService.getBookedDatesByCabinId(cabin.id),
    unauthSettingService.getDefaultSettings(),
  ] as const;

  const [bookedDates, settingResult] = await Promise.all(promises);

  if (bookedDates.errors) throw errorHelper.handleError(bookedDates.errors);

  if (settingResult.errors) throw errorHelper.handleError(settingResult.errors);

  return (
    <>
      <ReservationForm cabin={cabin} />
      <ReservationSummary
        setting={settingResult.data}
        alreadyBookedDates={bookedDates.data}
        cabin={cabin}
      />
    </>
  );
}
