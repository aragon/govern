import { task } from 'hardhat/config'
import { verifyContract } from '../../helpers/etherscan-verification'
import {
  buildName,
  getContract,
  getGovernBaseFactory,
  getGovernRegistry,
  setBRE,
} from '../../helpers/helpers'
import { logDeploy, logInfo } from '../../helpers/logger'
import { eContractid } from '../../helpers/types'
import { GovernBaseFactory } from '../../typechain'

const ZERO_ADDR = '0x0000000000000000000000000000000000000000'
const ZERO_BYTES =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

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
        token = `0x${'00'.repeat(20)}`,
        tokenName = name,
        tokenSymbol = 'GOV',
      },
      BRE
    ) => {
      setBRE(BRE)
      const currentNetwork = BRE.network.name

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

      const queueAddress = args?.args[1]
      const governAddress = args?.args[0]

      if (verify) {
        const { keccak256, solidityPack } = BRE.ethers.utils

        const salt = useProxies
          ? keccak256(solidityPack(['string'], [name]))
          : ZERO_BYTES

        const config = {
          executionDelay: '0',
          scheduleDeposit: [ZERO_ADDR, '0'],
          challengeDeposit: [ZERO_ADDR, '0'],
          resolver: ZERO_ADDR,
          rules: '0x',
        }

        const queueArgs = [baseFactory.address, config, salt]
        const governArgs = [queueAddress, salt]

        await verifyContract(queueAddress, queueArgs)
        await verifyContract(governAddress, governArgs)
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
