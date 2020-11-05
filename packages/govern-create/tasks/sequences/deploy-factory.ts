import { task } from 'hardhat/config'
import { getGovernRegistry, setBRE } from '../../helpers/helpers'
import {
  deployGoverBaseFactory,
  deployGoverFactory,
  deployGoverQueueFactory,
  deployGoverTokenFactory,
} from '../../helpers/delploys'
import { Address, eContractid } from '../../helpers/types'
import { registerContractInJsonDb } from '../../helpers/artifactsDb'

const { GovernBaseFactory } = eContractid

task('deploy-factory', 'Deploys an GovernBaseDeployer instance')
  .addOptionalParam('registry', 'GovernRegistry address')
  .addFlag('verify', 'Verify the contracts via Etherscan API')
  .setAction(
    async (
      { registry, verify }: { registry: Address; verify: boolean },
      BRE
    ) => {
      setBRE(BRE)
      const currentNetwork = BRE.network.name

      const factoryGovern = await deployGoverFactory(currentNetwork, verify)
      const queueDeployer = await deployGoverQueueFactory(
        currentNetwork,
        verify
      )
      const tokenDeployer = await deployGoverTokenFactory(
        currentNetwork,
        verify
      )

      const baseDeployer = await deployGoverBaseFactory(
        [
          registry ?? (await getGovernRegistry()).address,
          factoryGovern.address,
          queueDeployer.address,
          tokenDeployer.address,
        ],
        currentNetwork,
        verify
      )

      await registerContractInJsonDb(GovernBaseFactory, baseDeployer)
    }
  )
