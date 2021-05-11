/* eslint-disable */
import { format } from 'date-fns';

export function formatDate(date: number | string) {
    try {
        if (typeof date === 'string') {
            date = parseInt(date, 10)
        }
        return format(date * 1000, 'MMM dd yyyy HH:mm', {});
    } catch (e) {
        return date
    }
}