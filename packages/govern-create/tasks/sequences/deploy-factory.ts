import { task } from 'hardhat/config'
import { getContract, getGovernRegistry, setHRE } from '../../helpers/helpers'
import {
  deployGoverBaseFactory,
  deployGoverFactory,
  deployGoverQueueFactory,
  deployGoverTokenFactory,
} from '../../helpers/delploys'
import { Address, eContractid } from '../../helpers/types'
import { registerContractInJsonDb } from '../../helpers/artifactsDb'

const { Govern, GovernBase, GovernBaseFactory, Queue, QueueBase } = eContractid

task('deploy-factory', 'Deploys an GovernBaseFactory instance')
  .addOptionalParam('registry', 'GovernRegistry address')
  .addFlag('verify', 'Verify the contracts via Etherscan API')
  .setAction(
    async (
      { registry, verify }: { registry: Address; verify: boolean },
      HRE
    ) => {
      setHRE(HRE)
      const currentNetwork = HRE.network.name

      const queueFactory = await deployGoverQueueFactory(currentNetwork, verify)
      const governFactory = await deployGoverFactory(currentNetwork, verify)
      const tokenFactory = await deployGoverTokenFactory(currentNetwork, verify)

      const baseFactory = await deployGoverBaseFactory(
        [
          registry ?? (await getGovernRegistry()).address,
          governFactory.address,
          queueFactory.address,
          tokenFactory.address,
        ],
        currentNetwork,
        verify
      )

      const queueBase = await queueFactory.base()
      const governBase = await governFactory.base()

      await registerContractInJsonDb(GovernBaseFactory, baseFactory)
      await registerContractInJsonDb(
        GovernBase,
        await getContract(Queue, queueBase)
      )
      await registerContractInJsonDb(
        QueueBase,
        await getContract(Govern, governBase)
      )
    }
  )
