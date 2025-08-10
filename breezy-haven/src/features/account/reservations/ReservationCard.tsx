import { PreviewImage } from '@/features/cabins';
import { DTOBooking, type NonNullableObject } from '@/repositories';
import { METADATA } from '@/shared';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import { format, formatDistance, isPast, isToday, parseISO } from 'date-fns';

export default function ReservationCard({
  booking,
  cabin,
}: {
  booking: NonNullableObject<DTOBooking>;
  cabin: {
    name: string;
    image: string;
  };
}) {
  return (
    <article className='border-primary-800 flex flex-col overflow-hidden rounded-md border md:flex-row'>
      <div className='flex flex-grow flex-col lg:flex-row'>
        <Information cabin={cabin} booking={booking} />
      </div>
      <div className='border-primary-800 flex border-t md:flex-col md:border-t md:border-l'>
        <Modification id={booking.id} />
      </div>
    </article>
  );
}

function Modification({ id }: { id: number }) {
  const styles =
    'group text-primary-300 border-primary-800 hover:bg-accent-600 hover:text-primary-900 flex flex-1 items-center justify-center gap-2 px-4 py-6 text-xs font-bold uppercase transition-colors ';

  return (
    <>
      <a
        href={`${METADATA.account.nested.reservations.href}/edit/${id}`}
        className={`${styles} md:border-b`}
      >
        <PencilSquareIcon className='text-primary-600 group-hover:text-primary-800 h-5 w-5 transition-colors' />
        <span className='mt-1'>Edit</span>
      </a>
      <button className={styles}>
        <TrashIcon className='text-primary-600 group-hover:text-primary-800 h-5 w-5 transition-colors' />
        <span className='mt-1'>Delete</span>
      </button>
    </>
  );
}

function Information({
  cabin,
  booking,
}: {
  cabin: { image: string; name: string };
  booking: NonNullableObject<DTOBooking>;
}) {
  return (
    <>
      <div className='relative aspect-square h-52 w-full lg:h-full lg:w-52 xl:w-64'>
        <PreviewImage
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          fill
          src={cabin.image}
          alt={`Cabin ${cabin.name}`}
          className='object-cover'
        />
      </div>

      <div className='flex flex-grow flex-col justify-center-safe gap-y-4 p-6'>
        <div className='flex items-center justify-between'>
          <h3 className='text-xl font-semibold'>
            {booking.numNights} nights in Cabin {cabin.name}
          </h3>
          {isPast(new Date(booking.startDate)) ? (
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
          {format(new Date(booking.startDate), 'EEE, MMM dd yyyy')} (
          {isToday(new Date(booking.startDate))
            ? 'Today'
            : formatDistanceFromNow(booking.startDate)}
          ) &mdash; {format(new Date(booking.endDate), 'EEE, MMM dd yyyy')}
        </p>

        <div className='flex flex-col items-center gap-5 md:flex-row'>
          <p className='flex w-full max-w-38 justify-between'>
            <span className='text-accent-400 text-xl font-semibold'>
              ${booking.totalPrice}
            </span>
            <span className='text-primary-300'>&bull;</span>
            <span className='text-primary-300 text-lg'>
              {booking.numGuests} guest{booking.numGuests > 1 && 's'}
            </span>
          </p>

          <p className='text-primary-400 ml-auto text-sm'>
            Booked {format(new Date(booking.created_at), 'EEE, MMM dd yyyy, p')}
          </p>
        </div>
      </div>
    </>
  );
}

function formatDistanceFromNow(date: string) {
  return formatDistance(parseISO(date), new Date(), {
    addSuffix: true,
  }).replace('about ', '');
}
