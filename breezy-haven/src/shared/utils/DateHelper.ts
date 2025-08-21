import {
  eachDayOfInterval,
  formatISO,
  isBefore,
  isSameDay,
  isWithinInterval,
  startOfDay,
} from 'date-fns';
import type { DateRange } from 'react-day-picker';

class DateHelper {
  toISODateOnly(date?: Date) {
    if (!date) return '';

    const utcDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    return formatISO(utcDate, { representation: 'complete' });
  }

  isDateRangeValid(range: DateRange, alreadyBookedDates: readonly Date[]) {
    if (!range.from || !range.to) return true;
    const today = startOfDay(new Date());
    const days = eachDayOfInterval({
      start: startOfDay(range.from),
      end: startOfDay(range.to),
    });
    return days.every(
      day =>
        !alreadyBookedDates.some(d => isSameDay(d, day)) &&
        !isBefore(day, today)
    );
  }

  excludeDatesInRange(
    dates: readonly Date[],
    { from, to }: { from: Date; to: Date }
  ): readonly Date[] {
    const start = startOfDay(from);
    const end = startOfDay(to);

    return dates.filter(date => {
      const today = startOfDay(date);

      return !isWithinInterval(today, { start, end });
    });
  }
}

export const dateHelper = new DateHelper();
