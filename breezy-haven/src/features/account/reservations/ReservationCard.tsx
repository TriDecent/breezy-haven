'use client';
import { default as PreviewImage } from '@/features/cabins/components/ui/PreviewImage';
import { DTOBooking, type NonNullableObject } from '@/repositories';
import { format, formatDistance, isPast, isToday, parseISO } from 'date-fns';
import Modification from './Modification';

export default function ReservationCard({
  booking,
  cabin,
  onDelete,
}: {
  booking: NonNullableObject<DTOBooking>;
  cabin: {
    name: string;
    image: string;
  };
  onDelete: () => void;
}) {
  return (
    <article className='border-primary-800 flex flex-col overflow-hidden rounded-md border shadow-sm shadow-black md:flex-row'>
      <Information cabin={cabin} booking={booking} />

      {!isPast(booking.startDate) ? (
        <Modification id={booking.id} onDelete={onDelete} />
      ) : null}
    </article>
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
    <div className='flex flex-grow flex-col lg:flex-row'>
      <div className='aspect-square h-52 w-full flex-none overflow-hidden lg:h-full lg:w-52'>
        <PreviewImage
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          fill
          src={cabin.image}
          alt={`Cabin ${cabin.name}`}
          className='object-cover transition-transform duration-300 hover:scale-150 active:scale-150'
        />
      </div>

      <div className='flex flex-grow flex-col justify-center-safe gap-y-4 p-6'>
        <BookingHeader
          numNights={booking.numNights}
          cabinName={cabin.name}
          shouldRenderPast={isPast(booking.startDate)}
        />

        <p className='text-primary-300 text-lg'>
          {format(booking.startDate, 'EEE, MMM dd yyyy')} (
          {isToday(booking.startDate)
            ? 'Today'
            : formatDistanceFromNow(booking.startDate)}
          ) &mdash; {format(booking.endDate, 'EEE, MMM dd yyyy')}
        </p>

        <BookingDetails
          price={booking.totalPrice}
          guestCount={booking.numGuests}
          createdOn={format(booking.created_at, 'EEE, MMM dd yyyy, p')}
        />
        {booking.observations && booking.observations.length > 0 ? (
          <p className='text-primary-300'>
            Note: <span className='text-sm italic'>{booking.observations}</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}

function BookingHeader({
  numNights,
  cabinName,
  shouldRenderPast,
}: {
  numNights: number;
  cabinName: string;
  shouldRenderPast: boolean;
}) {
  return (
    <div className='flex items-center justify-between'>
      <h3 className='text-xl font-semibold'>
        {numNights} nights in Cabin {cabinName}
      </h3>
      {shouldRenderPast ? (
        <span className='flex h-7 items-center rounded-sm bg-yellow-800 px-3 text-xs font-bold text-yellow-200 uppercase'>
          past
        </span>
      ) : (
        <span className='flex h-7 items-center rounded-sm bg-green-800 px-3 text-xs font-bold text-green-200 uppercase'>
          upcoming
        </span>
      )}
    </div>
  );
}

function BookingDetails({
  price,
  guestCount,
  createdOn,
}: {
  price: number;
  guestCount: number;
  createdOn: string;
}) {
  return (
    <div className='flex flex-col items-center gap-5 md:flex-row'>
      <p className='flex w-full max-w-38 justify-between'>
        <span className='text-accent-400 text-xl font-semibold'>${price}</span>
        <span className='text-primary-300'>&bull;</span>
        <span className='text-primary-300 text-lg'>
          {guestCount} guest{guestCount > 1 && 's'}
        </span>
      </p>

      <p className='text-primary-400 ml-auto text-sm'>Booked on {createdOn}</p>
    </div>
  );
}

function formatDistanceFromNow(date: string) {
  return formatDistance(parseISO(date), Date.now(), {
    addSuffix: true,
  }).replace('about ', '');
}
