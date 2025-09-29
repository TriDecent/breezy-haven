import {
  staffBookingService,
  staffCabinService,
  type BookingWithRelations,
} from '@/services';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components';
import { errorHelper, formatter } from '@/shared/utils';
import { format, isToday, isWithinInterval, parseISO, subDays } from 'date-fns';

import type { Booking } from '@/shared/schemas';
import type { BookingQuery } from './BookingQuerySchema';
import { SalesChart, type Sale } from './SalesChart';
import { Stats } from './Stats';
import { StayDurationChart, type StayDurationPie } from './StayDurationChart';
import { TodayActivity } from './todayActivity/TodayActivity';

export async function DataOverview({ queryDays }: { queryDays: BookingQuery }) {
  const [{ data: bookings, errors: bookingErrors }, cabinCountResult] =
    await Promise.all([
      staffBookingService.getAllBookingsWithRelations(),
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
    <div className='space-y-16'>
      <StatsSection
        bookings={filteredBookings}
        cabinCount={cabinCountResult.payload}
        days={queryDays}
      />

      <div className='flex flex-col gap-x-8 gap-y-16 xl:flex-row'>
        <TodayActivitySection bookings={filteredBookings} />
        <StayDurationSection bookings={filteredBookings} />
      </div>

      <SalesSection bookings={filteredBookings} />
    </div>
  );
}

function TodayActivitySection({
  bookings,
}: {
  bookings: readonly BookingWithRelations[];
}) {
  const todayBookings = bookings.filter(
    booking =>
      (booking.status === 'unconfirmed' &&
        isToday(parseISO(booking.startDate))) ||
      (booking.status === 'checked-in' && isToday(parseISO(booking.endDate)))
  );

  return (
    <Card className='h-fit flex-1'>
      <CardHeader>
        <CardTitle className='text-muted-foreground font-bold tracking-wider'>
          Today&apos;s Activity
        </CardTitle>
        <CardDescription>
          See all check-ins, check-outs, and new bookings for today.
        </CardDescription>
      </CardHeader>

      <CardContent className='px-2'>
        {todayBookings.length > 0 ? (
          <TodayActivity bookings={todayBookings} />
        ) : (
          <p className='flex h-12 items-center justify-center'>
            There are no bookings due today.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function StayDurationSection({ bookings }: { bookings: readonly Booking[] }) {
  const pieData = new Map<StayDurationPie['name'], number>();

  for (const booking of bookings) {
    switch (getStayDurationGroup(booking.numNights)) {
      case 'oneNight':
        pieData.set('oneNight', (pieData.get('oneNight') ?? 0) + 1);
        break;
      case 'twoNight':
        pieData.set('twoNight', (pieData.get('twoNight') ?? 0) + 1);
        break;
      case 'threeNight':
        pieData.set('threeNight', (pieData.get('threeNight') ?? 0) + 1);
        break;
      case 'fourToFiveNight':
        pieData.set(
          'fourToFiveNight',
          (pieData.get('fourToFiveNight') ?? 0) + 1
        );
        break;
      case 'sixToSevenNight':
        pieData.set(
          'sixToSevenNight',
          (pieData.get('sixToSevenNight') ?? 0) + 1
        );
        break;
      case 'eightToFourteenNight':
        pieData.set(
          'eightToFourteenNight',
          (pieData.get('eightToFourteenNight') ?? 0) + 1
        );
        break;
      case 'fifteenToTwentyOneNight':
        pieData.set(
          'fifteenToTwentyOneNight',
          (pieData.get('fifteenToTwentyOneNight') ?? 0) + 1
        );
        break;
      case 'aboveTwentyOneNight':
        pieData.set(
          'aboveTwentyOneNight',
          (pieData.get('aboveTwentyOneNight') ?? 0) + 1
        );
        break;
    }
  }

  return (
    <Card className='max-w-xl flex-1 lg:mb-auto lg:w-2/3 lg:self-end'>
      <CardHeader>
        <CardTitle className='text-muted-foreground font-bold tracking-wider'>
          Stay Duration Summary
        </CardTitle>
        <CardDescription>
          Distribution of bookings by stay duration (number of nights).
        </CardDescription>
      </CardHeader>
      <CardContent>
        {pieData.size > 0 ? (
          <StayDurationChart
            pieData={[
              ...pieData.entries().map(([name, value]) => ({
                name,
                value,
              })),
            ]}
          />
        ) : (
          <p className='flex h-12 items-center justify-center'>No result</p>
        )}
      </CardContent>
    </Card>
  );
}

function getStayDurationGroup(numNights: number): StayDurationPie['name'] {
  if (numNights === 1) return 'oneNight';
  if (numNights === 2) return 'twoNight';
  if (numNights === 3) return 'threeNight';
  if (numNights >= 4 && numNights <= 5) return 'fourToFiveNight';
  if (numNights >= 6 && numNights <= 7) return 'sixToSevenNight';
  if (numNights >= 8 && numNights <= 14) return 'eightToFourteenNight';
  if (numNights >= 15 && numNights <= 21) return 'fifteenToTwentyOneNight';
  return 'aboveTwentyOneNight';
}

function StatsSection({
  bookings,
  cabinCount,
  days,
}: {
  bookings: readonly Booking[];
  cabinCount: number;
  days: number;
}) {
  const stats = bookings.reduce(
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
        <CardTitle className='text-muted-foreground font-bold tracking-wider'>
          Sales{' '}
          {bookings.length > 0
            ? `from ${sales.at(0)?.date} — ${sales.at(-1)?.date}`
            : null}
        </CardTitle>
        <CardDescription>
          Overview of total and extra sales generated from bookings within the
          selected period.
        </CardDescription>
      </CardHeader>

      <CardContent className='px-4'>
        {sales.length > 0 ? (
          <SalesChart sales={sales} />
        ) : (
          <p className='flex h-12 items-center justify-center'>No result</p>
        )}
      </CardContent>
    </Card>
  );
}
