export const container: any = {
  'config': {
    'executionDelay': 3600, // how many seconds to wait before being able to call `execute`.
    'scheduleDeposit': {
      'token': '0x0000000000000000000000000000000000000000',
      'amount': 100
    },
    'challengeDeposit': {
      'token': '0x0000000000000000000000000000000000000000',
      'amount': 100
    },
    'resolver': '0x0000000000000000000000000000000000000000',
    'rules': '0x',
    'maxCalldataSize': 100000 // initial maxCalldatasize
  },
  'payload': {
    'nonce': 1,
    'executionTime': 1000,
    'submitter': '0x0000000000000000000000000000000000000000',
    'executor': '0x0000000000000000000000000000000000000000',
    'actions': [
      {
        'to': '0x0000000000000000000000000000000000000000',
        'value': 1000,
        'data': '0x00'
      }
    ],
    'allowFailuresMap': '0x0000000000000000000000000000000000000000000000000000000000000000',
    'proof': '0x00'
  }
}
