import { format } from 'date-fns';

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

export function isIPFShash(/*_value: string*/): boolean {
  // check for value being an ipfs hash
  return false;
}

export function objectIsEmptyOrUndefined(obj: any) {
  return Object.keys(obj).length === 0 || obj === undefined;
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

export function getErrorFromException(ex: any): string {
  let errorMessage = ex.error?.message || ex.reason || ex.message;
  if (!errorMessage) {
    try {
      errorMessage = JSON.stringify(ex);
    } catch {
      errorMessage = 'Unknown error';
    }
  }
  return errorMessage;
}
