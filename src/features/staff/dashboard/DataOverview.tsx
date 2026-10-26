import {
  staffBookingService,
  staffCabinService,
  type BookingWithRelations,
} from '@/services';
import {
  AnimationWrapper,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ScrollArea,
  ScrollBar,
} from '@/shared/components';
import type { Booking } from '@/shared/schemas';
import { errorHelper, formatter } from '@/shared/utils';
import {
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
  isWithinInterval,
  parseISO,
  subDays,
} from 'date-fns';
import { ArrowBigDownDash } from 'lucide-react';
import type { BookingQuery } from './BookingQuerySchema';
import { DataRefresh } from './DataRefresh';
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

  const today = new Date();
  const startDate = subDays(today, queryDays);

  const filteredBookings = bookings.filter(booking =>
    isWithinInterval(parseISO(booking.created_at), {
      start: startDate,
      end: today,
    })
  );

  return (
    <div className='space-y-16'>
      <AnimationWrapper>
        <DataRefresh />
      </AnimationWrapper>

      <AnimationWrapper>
        <StatsSection
          bookings={filteredBookings}
          cabinCount={cabinCountResult.payload}
          days={queryDays}
        />
      </AnimationWrapper>

      <div className='flex flex-col gap-x-8 gap-y-16 xl:flex-row'>
        <AnimationWrapper className='h-fit flex-1'>
          <TodayActivitySection bookings={filteredBookings} />
        </AnimationWrapper>
        <AnimationWrapper className='max-w-xl flex-1 lg:mb-auto lg:w-2/3 lg:self-end'>
          <StayDurationSection bookings={filteredBookings} />
        </AnimationWrapper>
      </div>

      <AnimationWrapper>
        <SalesSection bookings={bookings} queryDays={queryDays} />
      </AnimationWrapper>
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
    <Card>
      <CardHeader>
        <CardTitle className='text-muted-foreground font-bold tracking-wider'>
          Today&apos;s Activity
        </CardTitle>
        <CardDescription>
          See all check-ins, check-outs, and new bookings for today.
        </CardDescription>
      </CardHeader>

      <CardContent className='px-2'>
        <ScrollArea className='h-70'>
          <ScrollBar orientation='vertical' />
          <TodayActivity bookings={todayBookings} />
        </ScrollArea>
      </CardContent>
      {todayBookings.length > 3 ? (
        <CardFooter className='justify-center'>
          <ArrowBigDownDash
            size={32}
            className='text-muted-foreground animate-bounce'
          />
        </CardFooter>
      ) : null}
    </Card>
  );
}

function StayDurationSection({ bookings }: { bookings: Booking[] }) {
  const pieData = new Map<StayDurationPie['name'], number>();

  for (const booking of bookings) {
    const durationGroup = getStayDurationGroup(booking.numNights);
    pieData.set(durationGroup, (pieData.get(durationGroup) ?? 0) + 1);
  }

  return (
    <Card>
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
              ...Array.from(pieData.entries()).map(([name, value]) => ({
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
    { totalBookings: 0, totalSales: 0, totalCheckIns: 0, totalNights: 0 }
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

function SalesSection({
  bookings,
  queryDays,
}: {
  bookings: readonly Booking[];
  queryDays: number;
}) {
  const today = new Date();
  const startDate = subDays(today, queryDays);

  const allDays = eachDayOfInterval({
    start: startDate,
    end: today,
  });

  const sales = allDays.map(day => {
    const dayBookings = bookings.filter(booking =>
      isSameDay(parseISO(booking.created_at), day)
    );

    return {
      date: format(day, 'PPP'),
      total: dayBookings.reduce((sum, b) => sum + b.totalPrice, 0),
      extra: dayBookings.reduce((sum, b) => sum + b.extrasPrice, 0),
    };
  }) satisfies Sale[];

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-muted-foreground font-bold tracking-wider'>
          Sales{' '}
          {sales.length > 0
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
