import { task } from 'hardhat/config'
import { getGovernRegistry, setBRE } from '../../helpers/helpers'
import {
  deployGoverBaseFactory,
  deployGoverDeployer,
  deployGoverQueueDeployer,
  deployGoverTokenDeployer,
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

      const governDeployer = await deployGoverDeployer(currentNetwork, verify)
      const queueDeployer = await deployGoverQueueDeployer(
        currentNetwork,
        verify
      )
      const tokenDeployer = await deployGoverTokenDeployer(
        currentNetwork,
        verify
      )

      const baseDeployer = await deployGoverBaseFactory(
        [
          registry ?? (await getGovernRegistry()).address,
          governDeployer.address,
          queueDeployer.address,
          tokenDeployer.address,
        ],
        currentNetwork,
        verify
      )

      await registerContractInJsonDb(GovernBaseFactory, baseDeployer)
    }
  )
