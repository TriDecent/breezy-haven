import { formatISO } from 'date-fns';
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
    const days = [];
    const current = new Date(range.from);
    while (current <= range.to) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days.every(
      day =>
        !alreadyBookedDates.some(d => d.getTime() === day.getTime()) &&
        day >= new Date()
    );
  }
}

export const dateHelper = new DateHelper();
