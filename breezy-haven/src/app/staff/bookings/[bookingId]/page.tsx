import { StatusBadge } from '@/features/staff/bookings';
import { BookingDetails } from '@/features/staff/bookings/[bookingId]';
import { Button, ROUTES } from '@/shared';
import { ArrowLeftCircleIcon } from 'lucide-react';
import Link from 'next/link';

export default async function BookingEditPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const bookingId = Number((await params).bookingId);

  if (isNaN(bookingId)) throw new Error('Booking id not valid!');

  return (
    <section>
      <div className='mb-8 flex items-center justify-between'>
        <div className='flex flex-col items-center gap-2 sm:flex-row'>
          <h1 className='text-accent-500 text-xl font-semibold tracking-widest'>
            Booking #{bookingId}
          </h1>

          <StatusBadge status={'checked-in'} className='px-4 py-1 text-sm' />
        </div>
        <Button variant='link' asChild>
          <Link href={ROUTES.staff.nested.bookings} className='underline'>
            <ArrowLeftCircleIcon />
            Back
          </Link>
        </Button>
      </div>

      <BookingDetails />
    </section>
  );
}
