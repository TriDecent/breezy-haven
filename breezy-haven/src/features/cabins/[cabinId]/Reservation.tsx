import { bookingRepository, Cabin, settingRepository } from '@/repositories';
import ReservationDateRangeSelector from './ReservationDateRangeSelector';
import ReservationForm from './ReservationForm';

export default async function Reservation({ cabin }: { cabin: Cabin }) {
  const promises = [
    bookingRepository.getBookedDatesByCabinId(cabin.id),
    settingRepository.getDefaultSettings(),
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
