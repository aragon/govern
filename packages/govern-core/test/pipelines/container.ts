import { ERC3000DefaultConfig } from 'erc3k/utils/ERC3000'

export const container: any = {
  config: ERC3000DefaultConfig,
  payload: {
    nonce: 1,
    executionTime: 1000,
    submitter: '0x0000000000000000000000000000000000000000',
    executor: '0x0000000000000000000000000000000000000000',
    actions: [
      {
        to: '0x0000000000000000000000000000000000000000',
        value: 1000,
        data: '0x00',
      },
    ],
    allowFailuresMap:
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    proof: '0x00',
  },
}
