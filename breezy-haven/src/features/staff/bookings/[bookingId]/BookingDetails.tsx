'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  type Booking,
} from '@/shared';
import { HomeModernIcon } from '@heroicons/react/24/solid';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import {
  CircleCheckIcon,
  CircleDollarSignIcon,
  Contact2Icon,
  TicketsIcon,
} from 'lucide-react';
import Image from 'next/image';
import { createContext, use } from 'react';

const BookingContext = createContext<BookingDetailsProps['booking'] | null>(
  null
);

type BookingDetailsProps = {
  readonly booking: Booking & {
    readonly cabin: Readonly<{
      image: string;
      id: number;
      name: string;
    }>;
    readonly guest: Readonly<{
      email: string;
      fullName: string;
      countryFlag: string;
      nationalID: string;
    }>;
  };
};

export function BookingDetails({ booking }: BookingDetailsProps) {
  return (
    <Card className='mx-auto max-w-5xl overflow-hidden p-0'>
      <BookingContext value={booking}>
        <CardHeader className='bg-accent/30 gap-8 border-b py-4 dark:bg-slate-800'>
          <SummaryBooking />
          <CardDescription className='ml-auto'>
            Booked via website
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-8'>
          <DetailBooking />
        </CardContent>
        <CardFooter className='text-muted-foreground ml-auto px-8 py-4 text-sm'>
          {format('2025-05-10T12:31:00Z', 'PPPPpppp')}
        </CardFooter>
      </BookingContext>
    </Card>
  );
}

function SummaryBooking() {
  const booking = use(BookingContext);
  if (!booking) return null;

  return (
    <>
      <p className='flex justify-between'>
        <span className='flex items-center gap-2'>
          <TicketsIcon size={28} />
          Booking Information
        </span>
        <span className='flex items-center gap-2'>
          <Contact2Icon size={28} /> {booking.guest.fullName}
        </span>
      </p>

      <div className='flex flex-col items-center justify-between gap-4 lg:flex-row'>
        <div className='space-y-4'>
          <span className='flex w-fit items-center gap-1'>
            <HomeModernIcon width={28} className='inline' />
            <span>
              {booking.numNights} nights in Cabin{' '}
              <strong className=''>{booking.cabin.name}</strong>
            </span>
          </span>

          <Image
            src={booking.cabin.image}
            width={160}
            height={90}
            style={{ width: '16rem', height: 'auto' }}
            alt='Cabin image'
            className='mx-auto aspect-video overflow-hidden rounded-lg mask-y-from-95% mask-x-from-95%'
          />
        </div>

        <p className='w-fit'>
          {format(booking.startDate, 'PPPP')} (
          {isPast(booking.startDate)
            ? `${formatDistanceToNow(booking.startDate)} ago`
            : `In ${formatDistanceToNow(booking.startDate)}`}
          ) &#8212; {format(booking.endDate, 'PPPP')}
        </p>
      </div>
    </>
  );
}

function DetailBooking() {
  const booking = use(BookingContext);
  if (!booking) return null;

  return (
    <>
      <ul className='marker:text-accent/50 flex list-inside list-disc flex-col gap-2 md:flex-row md:items-center lg:gap-4 dark:marker:text-slate-400'>
        <OwnerInformation />
      </ul>
      <p className='flex gap-8'>
        <span className='flex gap-1'>
          <CircleCheckIcon />
          Breakfast included?
        </span>
        <span>{booking.hasBreakfast ? 'Yes' : 'No'}</span>
      </p>

      <div className='bg-background flex flex-col items-center justify-between gap-y-4 rounded-sm p-4 md:flex-row'>
        <PriceDetails />
        <p className='uppercase'>will pay at property</p>
      </div>
    </>
  );
}

function OwnerInformation() {
  const booking = use(BookingContext);
  if (!booking) return null;

  return (
    <>
      <li className='flex flex-row items-center gap-2'>
        <Image
          src={booking.guest.countryFlag}
          width={160}
          height={90}
          style={{ width: 'auto', height: '1.5rem' }}
          alt='Country flag image'
          className='aspect-video overflow-hidden rounded-lg'
        />
        {booking.guest.fullName}
      </li>
      <li className='text-muted-foreground'>{booking.guest.email}</li>
      <li className='text-muted-foreground'>
        National ID {booking.guest.nationalID}
      </li>
    </>
  );
}

function PriceDetails() {
  const booking = use(BookingContext);
  if (!booking) return null;

  return (
    <div className='flex flex-col gap-x-4 gap-y-2 xl:flex-row'>
      <p className='flex gap-1'>
        <CircleDollarSignIcon /> Total price
      </p>
      <p>
        <span className='text-emerald-500'>
          $
          {booking.totalPrice.toLocaleString('en-us', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>{' '}
        (
        <span className='text-emerald-500'>
          $
          {booking.cabinPrice.toLocaleString('en-us', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>{' '}
        cabin +{' '}
        <span className='text-emerald-500'>
          $
          {booking.extrasPrice.toLocaleString('en-us', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>{' '}
        breakfast)
      </p>
    </div>
  );
}
