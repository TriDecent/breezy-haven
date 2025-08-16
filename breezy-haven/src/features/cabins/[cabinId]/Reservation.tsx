import { settingService, unauthBookingService } from '@/services';
import { errorHelper, type Cabin } from '@/shared';
import ReservationDateRangeSelector from './ReservationDateRangeSelector';
import ReservationForm from './ReservationForm';

export default async function Reservation({ cabin }: { cabin: Cabin }) {
  const promises = [
    unauthBookingService.getBookedDatesByCabinId(cabin.id),
    settingService.getDefaultSettings(),
  ] as const;

  const [bookedDates, settingResult] = await Promise.all(promises);

  if (bookedDates.errors) throw errorHelper.handleError(bookedDates.errors);

  if (settingResult.errors) throw errorHelper.handleError(settingResult.errors);

  return (
    <>
      <ReservationForm cabin={cabin} />
      <ReservationDateRangeSelector
        setting={settingResult.data}
        alreadyBookedDates={bookedDates.data}
        cabin={cabin}
      />
    </>
  );
}
