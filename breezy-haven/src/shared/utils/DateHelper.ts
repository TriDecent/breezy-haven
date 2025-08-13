import { formatISO } from 'date-fns';

class DateHelper {
  toISODateOnly(date?: Date) {
    if (!date) return '';

    const utcDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    return formatISO(utcDate, { representation: 'complete' });
  }
}

export const dateHelper = new DateHelper();
