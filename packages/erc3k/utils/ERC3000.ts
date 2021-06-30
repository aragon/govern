import { keccak256, defaultAbiCoder, solidityPack } from 'ethers/lib/utils'

export const ERC3000DefaultConfig = {
  executionDelay: 3600, // how many seconds to wait before being able to call `execute`.
  scheduleDeposit: {
    token: `0x${'00'.repeat(20)}`,
    amount: 0,
  },
  challengeDeposit: {
    token: `0x${'00'.repeat(20)}`,
    amount: 0,
  },
  resolver: `0x${'00'.repeat(20)}`,
  rules: '0x',
  maxCalldataSize: 100000, // initial maxCalldatasize
}

/**
 * Returns the hash of the container payload
 *
 * @param {Object} container
 *
 * @returns {string}
 */
export function getPayloadHash(container: any): string {
  return keccak256(
    defaultAbiCoder.encode(
      [
        'uint256',
        'uint256',
        'address',
        'address',
        'bytes32',
        'bytes32',
        'bytes32',
      ],
      [
        container.payload.nonce,
        container.payload.executionTime,
        container.payload.submitter,
        container.payload.executor,
        keccak256(
          defaultAbiCoder.encode(
            [
              'tuple(' +
                'address to, ' +
                'uint256 value, ' +
                'bytes data' +
                ')[]',
            ],
            [container.payload.actions]
          )
        ),
        container.payload.allowFailuresMap,
        keccak256(container.payload.proof),
      ]
    )
  )
}

/**
 * Returns the hash of the container config
 *
 * @param {Object} container
 *
 * @returns {string}
 */
export function getConfigHash(config: any): string {
  return keccak256(
    defaultAbiCoder.encode(
      [
        'tuple(' +
          'uint256 executionDelay, ' +
          'tuple(address token, uint256 amount) scheduleDeposit, ' +
          'tuple(address token, uint256 amount) challengeDeposit, ' +
          'address resolver, ' +
          'bytes rules, ' +
          'uint256 maxCalldataSize' +
          ')',
      ],
      [config]
    )
  )
}

/**
 * Returns the hash of the container
 *
 * @param {Object} container
 * @param {string} address
 * @param {string} chainId
 *
 * @returns {string}
 */
export function getContainerHash(
  container: any,
  address: string,
  chainId: number
): string {
  return keccak256(
    solidityPack(
      ['string', 'address', 'uint', 'bytes32', 'bytes32'],
      [
        'erc3k-v1',
        address,
        chainId,
        getPayloadHash(container),
        getConfigHash(container.config),
      ]
    )
  )
}

/**
 * Returns the ABI encoded container
 *
 * @param {Object} container
 *
 * @returns {string}
 */
export function getEncodedContainer(container: any): string {
  return defaultAbiCoder.encode(
    [
      'tuple(' +
        'tuple(' +
        'uint256 nonce, ' +
        'uint256 executionTime, ' +
        'address submitter, ' +
        'address executor, ' +
        'tuple(' +
        'address to, ' +
        'uint256 value, ' +
        'bytes data' +
        ')[] actions, ' +
        'bytes32 allowFailuresMap, ' +
        'bytes proof' +
        ') payload, ' +
        'tuple(' +
        'uint256 executionDelay, ' +
        'tuple(' +
        'address token, ' +
        'uint256 amount' +
        ') scheduleDeposit, ' +
        'tuple(' +
        'address token, ' +
        'uint256 amount' +
        ') challengeDeposit, ' +
        'address resolver, ' +
        'bytes rules, ' +
        'uint256 maxCalldataSize' +
        ') config' +
        ')',
    ],
    [container]
  )
}
