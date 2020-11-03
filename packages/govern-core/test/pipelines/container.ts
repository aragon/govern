export const container: any = {
  'config': {
    'executionDelay': 0,
    'scheduleDeposit': {
      'token': '',
      'amount': 100
    },
    'challengeDeposit': {
      'token': '',
      'amount': 100
    },
    'vetoDeposit': {
      'token': '',
      'amount': 100
    },
    'resolver': '0x0000000000000000000000000000000000000000',
    'rules': '0x'
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
