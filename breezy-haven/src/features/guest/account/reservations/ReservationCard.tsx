import type { Booking } from '@/shared/schemas';
import { isPast, isToday } from 'date-fns';
import Modification from './Modification';
import { ReservationInformation } from './ReservationInformation';

export default function ReservationCard({
  booking,
  cabin,
  onDelete,
}: {
  booking: Booking;
  cabin: {
    id: number;
    name: string;
    image: string;
  };
  onDelete: () => void;
}) {
  return (
    <article className='border-primary-800 flex flex-col overflow-hidden rounded-md border shadow-sm shadow-black md:flex-row'>
      <ReservationInformation cabin={cabin} booking={booking} />

      {!isPast(booking.startDate) || isToday(booking.startDate) ? (
        <Modification id={booking.id} onDelete={onDelete} />
      ) : null}
    </article>
  );
}
