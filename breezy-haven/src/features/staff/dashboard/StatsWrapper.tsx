import { staffBookingService, staffCabinService } from '@/services';
import { errorHelper, formatter } from '@/shared/utils';
import { isWithinInterval, parseISO, subDays } from 'date-fns';
import z from 'zod';
import { Stats } from './Stats';

export const bookingTimeFrames = [7, 30, 90];
export const QuerySchema = z.object({
  last: z.coerce.number().refine(num => bookingTimeFrames.includes(num)),
});
type Query = z.infer<typeof QuerySchema>['last'];

export async function StatsWrapper({ query }: { query: Query }) {
  const [{ data: bookings, errors: bookingErrors }, cabinCountResult] =
    await Promise.all([
      staffBookingService.getAll(),
      staffCabinService.getCount(),
    ]);

  if (bookingErrors) throw errorHelper.handleError(bookingErrors);
  if (cabinCountResult.type === 'error')
    throw new Error('Failed to fetch cabin count. Please try again!');

  const days = Number(query);
  const startDate = subDays(new Date(), days);

  const queryBookings = bookings.filter(booking =>
    isWithinInterval(parseISO(booking.created_at), {
      start: startDate,
      end: new Date(),
    })
  );

  const bookingCount = queryBookings.length;
  const sales = queryBookings.reduce(
    (accumulator, current) => accumulator + current.totalPrice,
    0
  );
  const checkinCount = queryBookings.reduce(
    (accumulator, current) =>
      current.status === 'checked-in' ? accumulator + 1 : accumulator,
    0
  );
  const occupancyRate =
    queryBookings.reduce(
      (accumulator, current) => accumulator + current.numNights,
      0
    ) /
    (cabinCountResult.payload * days);

  return (
    <Stats
      bookingCount={bookingCount.toString()}
      sales={`$${formatter.formatPrice(sales)}`}
      checkinCount={checkinCount.toString()}
      occupancyRate={`${formatter.formatNumber(occupancyRate * 100)}%`}
    />
  );
}
