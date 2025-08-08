import { DTOBooking } from '@/repositories';
import { METADATA } from '@/shared';
import { PencilSquareIcon } from '@heroicons/react/24/solid';
import { format, formatDistance, isPast, isToday, parseISO } from 'date-fns';
import Image from 'next/image';
import DeleteReservation from './DeleteReservation';

export const formatDistanceFromNow = (date: string) =>
  formatDistance(parseISO(date), new Date(), {
    addSuffix: true,
  }).replace('about ', '');

export default function ReservationCard({
  booking,
  cabin,
}: {
  booking: DTOBooking;
  cabin: {
    name: string;
    image: string;
  };
}) {
  // TODO: validate from booking
  const {
    id,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    guestId,
    startDate,
    endDate,
    numNights,
    totalPrice,
    numGuests,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    status,
    created_at,
  } = booking;
  const { name, image } = cabin;

  return (
    <div className='border-primary-800 flex border'>
      <div className='relative aspect-square h-32'>
        <Image
          src={image}
          alt={`Cabin ${name}`}
          className='border-primary-800 border-r object-cover'
        />
      </div>

      <div className='flex flex-grow flex-col px-6 py-3'>
        <div className='flex items-center justify-between'>
          <h3 className='text-xl font-semibold'>
            {numNights} nights in Cabin {name}
          </h3>
          {isPast(new Date(startDate ?? '')) ? (
            <span className='flex h-7 items-center rounded-sm bg-yellow-800 px-3 text-xs font-bold text-yellow-200 uppercase'>
              past
            </span>
          ) : (
            <span className='flex h-7 items-center rounded-sm bg-green-800 px-3 text-xs font-bold text-green-200 uppercase'>
              upcoming
            </span>
          )}
        </div>

        <p className='text-primary-300 text-lg'>
          {format(new Date(startDate ?? ''), 'EEE, MMM dd yyyy')} (
          {isToday(new Date(startDate ?? ''))
            ? 'Today'
            : formatDistanceFromNow(startDate ?? '')}
          ) &mdash; {format(new Date(endDate ?? ''), 'EEE, MMM dd yyyy')}
        </p>

        <div className='mt-auto flex items-baseline gap-5'>
          <p className='text-accent-400 text-xl font-semibold'>${totalPrice}</p>
          <p className='text-primary-300'>&bull;</p>
          <p className='text-primary-300 text-lg'>
            {numGuests ?? 1} guest{(numGuests ?? 1) > 1 && 's'}
          </p>
          <p className='text-primary-400 ml-auto text-sm'>
            Booked {format(new Date(created_at), 'EEE, MMM dd yyyy, p')}
          </p>
        </div>
      </div>

      <div className='border-primary-800 flex w-[100px] flex-col border-l'>
        <a
          href={`${METADATA.account.nested.reservations.href}/edit/${id}`}
          className='group text-primary-300 border-primary-800 hover:bg-accent-600 hover:text-primary-900 flex flex-grow items-center gap-2 border-b px-3 text-xs font-bold uppercase transition-colors'
        >
          <PencilSquareIcon className='text-primary-600 group-hover:text-primary-800 h-5 w-5 transition-colors' />
          <span className='mt-1'>Edit</span>
        </a>
        <DeleteReservation bookingId={id ?? 1} />
      </div>
    </div>
  );
}
