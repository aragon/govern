
export function getTruncatedAccountAddress(account: string | null) {
    if (account === null) return '';
    return (
        account.substring(0, 5) +
        '...' +
        account.substring(account.length - 5, account.length - 1)
    );
}