import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/shared';
import { HomeModernIcon } from '@heroicons/react/24/solid';
import {
  CircleCheckIcon,
  CircleDollarSignIcon,
  Contact2Icon,
  TicketsIcon,
} from 'lucide-react';
import Image from 'next/image';

export function BookingDetails() {
  return (
    <Card className='mx-auto max-w-5xl overflow-hidden p-0'>
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
        Booked Wed, May 10, 2025 12:31PM
      </CardFooter>
    </Card>
  );
}

function SummaryBooking() {
  return (
    <>
      <p className='flex justify-between'>
        <span className='flex items-center gap-2'>
          <TicketsIcon size={28} />
          Booking Information
        </span>
        <span className='flex items-center gap-2'>
          <Contact2Icon size={28} /> Emma Watson
        </span>
      </p>

      <p className='flex flex-col items-center justify-between gap-4 lg:flex-row'>
        <span className='flex w-fit items-end-safe gap-1'>
          <HomeModernIcon width={28} className='inline' />
          <span>15 nights in Cabin 007</span>
        </span>

        <span className='w-fit'>
          Sat, Jun 17 2025 (In 1 month) &#8212; Sun, Jul 02 2025
        </span>
      </p>
    </>
  );
}

function DetailBooking() {
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
        <span>Yes</span>
      </p>

      <div className='bg-background flex flex-col items-center justify-between gap-y-4 rounded-sm p-4 md:flex-row'>
        <PriceDetails />
        <p className='uppercase'>will pay at property</p>
      </div>
    </>
  );
}

function OwnerInformation() {
  return (
    <>
      <li className='flex flex-row items-center gap-2'>
        <Image
          src='https://flagcdn.com/gb.svg'
          width={160}
          height={90}
          style={{ width: 'auto', height: '1.5rem' }}
          alt='Country flag image'
          className='aspect-video overflow-hidden rounded-lg'
        />
        Emma Watson
      </li>
      <li className='text-muted-foreground'>emma@gmail.com</li>
      <li className='text-muted-foreground'>National ID 234234234234234</li>
    </>
  );
}

function PriceDetails() {
  return (
    <div className='flex flex-col gap-x-4 gap-y-2 xl:flex-row'>
      <p className='flex gap-1'>
        <CircleDollarSignIcon /> Total price
      </p>
      <p>
        <span className='text-emerald-500'>$5,352.00</span> (
        <span className='text-emerald-500'>$4,875.00</span> cabin +{' '}
        <span className='text-emerald-500'>$450.00</span> breakfast)
      </p>
    </div>
  );
}
