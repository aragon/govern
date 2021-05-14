import React from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

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
    if (typeof date === 'string') date = parseInt(date, 10) * 1000;
    const formattedDate = format(date, 'MMM dd yyyy HH:mm', {});
    return formattedDate;
  } catch (e) {
    return date;
  }
}

export function isIPFShash(value: string): boolean {
  // check for value being an ipfs hash
  return false;
}

// export function getFormattedValue(value: string) {
//   try {
//     if (isIPFShash(value)) {
//       return (
//         <Link to={value} target="_blank" rel="noopener noreferrer">
//           value
//         </Link>
//       );
//     } else return value;
//   } catch (e) {
//     return value;
//   }
// }
