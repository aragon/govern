import { format } from 'date-fns';

export const toMs = (seconds: number) => seconds * 1000;

export function formatDate(date: number | string) {
  try {
    if (typeof date === 'string') {
      date = parseInt(date, 10);
    }
    return format(date, 'MMM dd yyyy HH:mm', {});
  } catch (e) {
    return date;
  }
}
