/* eslint-disable */
import { format } from 'date-fns';

export function getFormattedDate(date?: number | string) {
    try {
        if (!date) {
            date = Date.now();
        }
        if (typeof date === 'string') {
            date = parseInt(date, 10) * 1000;
        }
        return format(date, 'MMM dd yyyy HH:mm', {});
    } catch (e) {
        return date;
    }
}