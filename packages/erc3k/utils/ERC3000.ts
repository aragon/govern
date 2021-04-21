export const ERC3000DefaultConfig = {
    executionDelay: 3600, // how many seconds to wait before being able to call `execute`.
    scheduleDeposit: {
        token: `0x${'00'.repeat(20)}`,
        amount: 0
    },
    challengeDeposit: {
        token: `0x${'00'.repeat(20)}`,
        amount: 0
    },
    resolver: `0x${'00'.repeat(20)}`,
    rules: "0x",
    maxCalldataSize: 100000 // initial maxCalldatasize
}
