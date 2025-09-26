import { staffBookingService, staffCabinService } from '@/services';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components';
import { errorHelper, formatter } from '@/shared/utils';
import { format, isWithinInterval, parseISO, subDays } from 'date-fns';

import type { Booking } from '@/shared/schemas';
import type { BookingQuery } from './BookingQuerySchema';
import { SalesChart, type Sale } from './SalesChart';
import { Stats } from './Stats';

export async function DataOverview({ queryDays }: { queryDays: BookingQuery }) {
  const [{ data: bookings, errors: bookingErrors }, cabinCountResult] =
    await Promise.all([
      staffBookingService.getAll(),
      staffCabinService.getCount(),
    ]);

  if (bookingErrors) throw errorHelper.handleError(bookingErrors);
  if (cabinCountResult.type === 'error')
    throw new Error('Failed to fetch cabin count. Please try again!');

  const startDate = subDays(new Date(), queryDays);

  const filteredBookings = bookings.filter(booking =>
    isWithinInterval(parseISO(booking.created_at), {
      start: startDate,
      end: new Date(),
    })
  );

  return (
    <>
      <StatsSection
        booking={filteredBookings}
        cabinCount={cabinCountResult.payload}
        days={queryDays}
      />

      <SalesSection bookings={filteredBookings} />
    </>
  );
}

function StatsSection({
  booking,
  cabinCount,
  days,
}: {
  booking: readonly Booking[];
  cabinCount: number;
  days: number;
}) {
  const stats = booking.reduce(
    (acc, cur) => {
      acc.totalBookings += 1;
      acc.totalSales += cur.totalPrice;
      if (cur.status === 'checked-in') acc.totalCheckIns += 1;
      acc.totalNights += cur.numNights;
      return acc;
    },
    {
      totalBookings: 0,
      totalSales: 0,
      totalCheckIns: 0,
      totalNights: 0,
    }
  );

  const occupancyRate =
    cabinCount && days ? stats.totalNights / (cabinCount * days) : 0;

  return (
    <Stats
      bookingCount={stats.totalBookings.toString()}
      sales={formatter.formatPrice(stats.totalSales)}
      checkinCount={stats.totalCheckIns.toString()}
      occupancyRate={`${formatter.formatNumber(occupancyRate * 100)}%`}
    />
  );
}

function SalesSection({ bookings }: { bookings: readonly Booking[] }) {
  const sales: Sale[] = bookings
    .toSorted(
      (a, b) =>
        parseISO(a.created_at).getTime() - parseISO(b.created_at).getTime()
    )
    .map(booking => ({
      date: format(parseISO(booking.created_at), 'PPP'),
      total: booking.totalPrice,
      extra: booking.extrasPrice,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales</CardTitle>
      </CardHeader>

      <CardContent className='px-4'>
        <SalesChart sales={sales} />
      </CardContent>
    </Card>
  );
}
