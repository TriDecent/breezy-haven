import type { DTOCabin, DTOSetting, NonNullableObject } from '@/repositories';
import { settingService, unauthBookingService } from '@/services';
import ReservationDateRangeSelector from './ReservationDateRangeSelector';
import ReservationForm from './ReservationForm';

export default async function Reservation({
  cabin,
}: {
  cabin: NonNullableObject<DTOCabin>;
}) {
  const promises = [
    unauthBookingService.getBookedDatesByCabinId(cabin.id),
    settingService.getDefaultSettings(),
  ] as const;

  const [bookingResult, settingResult] = await Promise.all(promises);

  if (bookingResult.error || settingResult.error || !settingResult.data)
    throw new Error(
      `Something wrong happened: Booking: ${bookingResult.error?.message} - Setting: ${settingResult.error?.message}`
    );

  return (
    <>
      <ReservationForm cabin={cabin} />
      <ReservationDateRangeSelector
        setting={settingResult.data as NonNullableObject<DTOSetting>}
        bookedDates={bookingResult.data}
        cabin={cabin}
      />
    </>
  );
}
