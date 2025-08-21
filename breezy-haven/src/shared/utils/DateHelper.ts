import {
  eachDayOfInterval,
  formatISO,
  isBefore,
  isSameDay,
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
}

export const dateHelper = new DateHelper();
