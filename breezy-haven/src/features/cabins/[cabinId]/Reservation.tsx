import type { DTOCabin, NonNullableObject } from '@/repositories';
import { settingService, unauthBookingService } from '@/services';
import { DefaultSettingSchema } from '@/shared';
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

  const [bookedDates, settingResult] = await Promise.all(promises);

  if (bookedDates.error || settingResult.error)
    throw new Error(
      `Something wrong happened: Booking: ${bookedDates.error?.message} - Setting: ${settingResult.error?.message}`
    );

  const parsedSettings = DefaultSettingSchema.safeParse(settingResult.data);

  if (!parsedSettings.success)
    throw new Error('Something is wrong with booked dates');

  return (
    <>
      <ReservationForm cabin={cabin} />
      <ReservationDateRangeSelector
        setting={parsedSettings.data}
        alreadyBookedDates={bookedDates.data}
        cabin={cabin}
      />
    </>
  );
}
