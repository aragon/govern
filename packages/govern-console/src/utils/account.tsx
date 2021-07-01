export function getTruncatedAccountAddress(account: string | null) {
  if (account === null) return '';
  return account.substring(0, 6) + '...' + account.substring(account.length - 4, account.length);
}
