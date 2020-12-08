import { ethers } from 'ethers'
import { task } from 'hardhat/config'
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator'

function buildName(name: string | null): string {
  const uniqueName =
    name ??
    uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      length: 2,
      separator: '-',
    })

  return process.env.CD ? `github-${uniqueName}` : uniqueName
}

const format = (address: string, name: string, network: string): string =>
  `- ${name}: https://${
    network === 'mainnet' ? '' : `${network}.`
  }etherscan.io/address/${address}`

task('deploy-govern', 'Deploys a Govern instance')
  .addOptionalParam('factory', 'GovernBaseFactory address')
  .addOptionalParam('useProxies', 'Whether to deploy govern with proxies')
  .addOptionalParam('name', 'DAO name (must be unique at GovernRegistry level)')
  .setAction(
    async (
      {
        factory,
        useProxies = true,
        name,
        token = `0x${'00'.repeat(20)}`,
        tokenName = name,
        tokenSymbol = 'GOV',
      },
      HRE
    ) => {
      name = buildName(name)
      const { ethers, deployments, network } = HRE

      const registryDeployment = await deployments.get('GovernRegistry')
      const registryContract = await ethers.getContractAt(
        'GovernRegistry',
        registryDeployment.address
      )

      const baseFactoryContract = factory
        ? await ethers.getContractAt('GovernBaseFactory', factory)
        : await ethers.getContractAt(
            'GovernBaseFactory',
            (await deployments.get('GovernBaseFactory')).address
          )

      const tx = await baseFactoryContract.newGovernWithoutConfig(
        name,
        token,
        tokenName || name,
        tokenSymbol,
        useProxies,
        {
          gasLimit: useProxies ? 2e6 : 9e6,
          gasPrice: 2e9,
        }
      )

      const { logs } = (await tx.wait()) as ethers.ContractReceipt

      const args = logs
        .filter(({ address }) => address === registryContract.address)
        .map((log) => registryContract.interface.parseLog(log))
        .find(({ name }) => name === 'Registered')

      const queueAddress = args?.args[1] as string
      const governAddress = args?.args[0] as string

      if (network.name !== 'hardhat' && network.name !== 'soliditycoverage') {
        console.log(`----\nA wild new Govern named *${name}* appeared 🦅`)
        console.log(format(queueAddress, 'Queue', network.name))
        console.log(format(governAddress, 'Govern', network.name))
      }
    }
  )
