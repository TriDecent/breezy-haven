import type { DTOCabin, NonNullableObject } from '@/repositories';
import { bookingService, settingService } from '@/services';
import ReservationDateRangeSelector from './ReservationDateRangeSelector';
import ReservationForm from './ReservationForm';

export default async function Reservation({
  cabin,
}: {
  cabin: NonNullableObject<DTOCabin>;
}) {
  const promises = [
    bookingService.getBookedDatesByCabinId(cabin.id),
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
        setting={settingResult.data}
        bookedDates={bookingResult.data}
        cabin={cabin}
      />
    </>
  );
}
