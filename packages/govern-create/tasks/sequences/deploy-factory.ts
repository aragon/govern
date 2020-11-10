import { task } from 'hardhat/config'
import { getGovernRegistry, setHRE } from '../../helpers/helpers'
import {
  deployGoverBaseFactory,
  deployGoverFactory,
  deployGoverQueueFactory,
  deployGoverTokenFactory,
} from '../../helpers/delploys'
import { Address, eContractid } from '../../helpers/types'
import { registerContractInJsonDb } from '../../helpers/artifactsDb'

const {
  GovernBase,
  GovernBaseFactory,
  GovernFactory,
  GovernTokenFactory,
  QueueBase,
  GovernQueueFactory,
} = eContractid

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

      await registerContractInJsonDb(GovernQueueFactory, queueFactory.address)
      await registerContractInJsonDb(QueueBase, governBase)
      await registerContractInJsonDb(GovernFactory, governFactory.address)
      await registerContractInJsonDb(GovernBase, queueBase)
      await registerContractInJsonDb(GovernTokenFactory, tokenFactory.address)
      await registerContractInJsonDb(GovernBaseFactory, baseFactory.address)
    }
  )
