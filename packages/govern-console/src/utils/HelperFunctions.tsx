import { format } from 'date-fns';
export function getTruncatedAccountAddress(account: string | null) {
  if (account === null) return '';
  return (
    account.substring(0, 5) +
    '...' +
    account.substring(account.length - 5, account.length - 1)
  );
}

export function getFormattedDate(date?: number | string) {
  try {
    if (!date) date = Date.now();
    if (typeof date === 'string') date = parseInt(date, 10);
    const formattedDate = format(date, 'MMM dd yyyy HH:mm', {});
    return formattedDate;
  } catch (e) {
    return date;
  }
}
