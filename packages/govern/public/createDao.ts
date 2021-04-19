import { Contract } from '@ethersproject/contracts'
import { Web3Provider } from '@ethersproject/providers'
import { AddressZero } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import Configuration from '../internal/configuration/Configuration'
// @TODO: Change this
import * as registryAbi from '../tests/hardhat/registryAbi.json'
import { registerToken } from '../internal/actions/RegisterToken'

const FACTORY_ABI = [
  'function newGovernWithoutConfig(string,address,string,string,bool)',
]

declare let window: any

export type Token = {
  address?: string
  symbol?: string
  name?: string
}

export type CreateDaoParams = {
  name: string
  token: Token
  useProxies?: boolean
  useVocdoni?: boolean
}

export type CreateDaoOptions = {
  provider?: any
  daoFactoryAddress?: string
}

/**
 * Create a Dao by the given name and token
 *
 * @param {args} parameters for DAO creation
 *
 * @param {options} options to overwrite with eip1193 provider and DAO factory address
 *
 * @returns {Promise<TransactionResponse>} transaction response object
 */
export async function createDao(
  args: CreateDaoParams,
  options: CreateDaoOptions = {}
): Promise<TransactionResponse> {
  let { address } = args.token

  if (!args.token.address) {
    address = AddressZero
  }

  if (address === AddressZero && (!args.token.name || !args.token.symbol)) {
    throw new Error('Missing token name and/or symbol')
  }

  const config = Configuration.get()
  const signer = await new Web3Provider(
    options.provider || window.ethereum
  ).getSigner()

  if (args.useVocdoni) {
    const GovernRegistry = new Contract(
      config.governRegistry,
      registryAbi,
      signer
    )
    const registerEvent = GovernRegistry.filters.Registered()
    GovernRegistry.on(registerEvent, async (queue, govern, token) => {
      if (token) {
        await new Promise((resolve) => {
          setTimeout(resolve, 5000)
        })

        const ERC20 = new Contract(
          token,
          /**
           * @TODO
           * Use human readable ABI
           * Check this example
           * https://github.com/aragon/govern/pull/321/commits/e8a689938ec591c217a0cd3efb0959603cae1a52#diff-a7fe3ac865c70c00b2dc156f26c6323b325d731d15efb06b0f86d8fbc0a517a8R9-R14
           */
          [
            {
              inputs: [
                {
                  name: '',
                  type: 'address',
                },
              ],
              name: 'balanceOf',
              outputs: [
                {
                  name: '',
                  type: 'uint256',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
          ],
          signer
        )        

        /**
         * @TODO
         * We should not do this scripts (registerToken) - Instead we should use their library
         * https://github.com/jordipainan/vocdoni-solidity-hardhat/blob/master/test/TokenStorageProofs.ts#L91-L106
         */
        const result = await registerToken(signer, ERC20)
        if (result) {
          await result.wait()
          console.log('Token registered!')
        }
      }
    })
  }

  const factoryAddress = options.daoFactoryAddress || config.daoFactoryAddress
  const contract = new Contract(factoryAddress, FACTORY_ABI, signer)
  const result = contract.newGovernWithoutConfig(
    args.name,
    address,
    args.token.name || '',
    args.token.symbol || '',
    args.useProxies
  )

  return result
}
