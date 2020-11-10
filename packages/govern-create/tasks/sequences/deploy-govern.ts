import { task } from 'hardhat/config'
import { verifyContract } from '../../helpers/etherscan-verification'
import {
  buildName,
  getContract,
  getGovernBaseFactory,
  getGovernRegistry,
  setHRE,
  NO_TOKEN,
  ZERO_ADDR,
} from '../../helpers/helpers'
import { logDeploy, logInfo } from '../../helpers/logger'
import { eContractid } from '../../helpers/types'
import { GovernBaseFactory } from '../../typechain'

task('deploy-govern', 'Deploys a Govern instance')
  .addOptionalParam('factory', 'GovernBaseFactory address')
  .addOptionalParam('useProxies', 'Whether to deploy govern with proxies')
  .addOptionalParam('name', 'DAO name (must be unique at GovernRegistry level)')
  .addFlag('verify', 'Verify the contracts via Etherscan API')
  .setAction(
    async (
      {
        factory,
        useProxies = true,
        name,
        verify,
        token = NO_TOKEN,
        tokenName = name,
        tokenSymbol = 'GOV',
      },
      HRE
    ) => {
      setHRE(HRE)
      const currentNetwork = HRE.network.name

      name = buildName(name)

      const registry = await getGovernRegistry()
      const baseFactory = factory
        ? await getContract<GovernBaseFactory>(
            eContractid.GovernBaseFactory,
            factory
          )
        : await getGovernBaseFactory()

      const tx = await baseFactory.newGovernWithoutConfig(
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

      const { logs } = await tx.wait()

      const args = logs
        .filter(({ address }) => address === registry.address)
        .map((log) => registry.interface.parseLog(log))
        .find(({ name }) => name === 'Registered')

      const queueAddress = args?.args[1] as string
      const governAddress = args?.args[0] as string

      if (verify && !useProxies) {
        const dummyConfig = {
          executionDelay: '0',
          scheduleDeposit: [NO_TOKEN, '0'],
          challengeDeposit: [NO_TOKEN, '0'],
          resolver: ZERO_ADDR,
          rules: '0x',
        }

        await verifyContract(queueAddress, [baseFactory.address, dummyConfig])
        await verifyContract(governAddress, [queueAddress])
      }

      if (
        currentNetwork !== 'hardhat' &&
        currentNetwork !== 'soliditycoverage'
      ) {
        logInfo(`----\nA wild new Govern named *${name}* appeared 🦅`)
        logDeploy(eContractid.Queue, currentNetwork, queueAddress)
        logDeploy(eContractid.Govern, currentNetwork, governAddress)
      }
    }
  )
