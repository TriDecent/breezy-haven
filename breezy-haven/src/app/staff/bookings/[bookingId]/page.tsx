import { StatusBadge } from '@/features/staff/bookings';
import { BookingDetails } from '@/features/staff/bookings/[bookingId]';
import {
  staffBookingService,
  staffSettingService,
  type BookingWithRelations,
} from '@/services';
import { Button, errorHelper, ROUTES } from '@/shared';
import { ArrowLeftCircleIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}): Promise<Metadata> {
  const bookingId = Number((await params).bookingId);

  if (isNaN(bookingId))
    return {
      title: `Booking cannot be found`,
    };

  const { data, errors } =
    await staffBookingService.getBookingWithRelationsById(bookingId);

  if (!errors) return { title: `Booking ${data.id}` };

  if (errors.type === 'database' && errors.db.code === 'PGRST116')
    return {
      title: `Booking ${bookingId} cannot be found`,
    };

  return {
    title: `Something is wrong with booking ${bookingId}`,
  };
}

export async function generateStaticParams(): Promise<
  readonly { readonly bookingId: string }[]
> {
  const { data, errors } = await staffBookingService.getAll();

  if (errors) return [];

  return data.map(booking => ({ bookingId: booking.id.toString() }));
}

export default async function BookingEditPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  // TODO: verify staff authentication
  const booking = await retrieveBookingAsync(params);
  const { data: setting, errors: settingErrors } =
    await staffSettingService.getAll();

  if (settingErrors) throw errorHelper.handleError(settingErrors);

  return (
    <section>
      <div className='mb-8 flex items-center justify-between'>
        <div className='flex flex-col items-center gap-2 sm:flex-row'>
          <h1 className='text-accent-500 text-xl font-semibold tracking-widest'>
            Booking #{booking.id}
          </h1>

          <StatusBadge status={booking.status} className='px-4 py-1 text-sm' />
        </div>
        <Button variant='link' asChild>
          <Link href={ROUTES.staff.nested.bookings.href} className='underline'>
            <ArrowLeftCircleIcon />
            Back
          </Link>
        </Button>
      </div>

      <BookingDetails booking={{ ...booking, setting: setting[0] }} />
    </section>
  );
}

async function retrieveBookingAsync(
  params: Promise<{ bookingId: string }>
): Promise<BookingWithRelations> {
  const bookingId = Number((await params).bookingId);

  if (isNaN(bookingId)) notFound();

  const { data, errors } =
    await staffBookingService.getBookingWithRelationsById(bookingId);

  if (errors) throw errorHelper.handleError(errors);

  return data;
}
