import { staffBookingService } from '@/services';
import { errorHelper } from '@/shared/utils';
import { format, isWithinInterval, parseISO, subDays } from 'date-fns';
import { SalesChart, type Sale } from './SalesChart';

export async function Sales({ query }: { query: number }) {
  const { data: bookings, errors } = await staffBookingService.getAll();
  if (errors) throw errorHelper.handleError(errors);

  const days = query;
  const startDate = subDays(new Date(), days);

  const queryBookings = bookings.filter(booking =>
    isWithinInterval(parseISO(booking.created_at), {
      start: startDate,
      end: new Date(),
    })
  );

  const sales: Sale[] = queryBookings
    .sort(
      (a, b) =>
        parseISO(a.created_at).getTime() - parseISO(b.created_at).getTime()
    )
    .map(booking => ({
      date: format(parseISO(booking.created_at), 'PPP'),
      total: booking.totalPrice,
      extra: booking.extrasPrice,
    }));

  return <SalesChart sales={sales} />;
}
