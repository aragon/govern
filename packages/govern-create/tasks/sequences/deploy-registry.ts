import { task } from 'hardhat/config'
import { registerContractInJsonDb } from '../../helpers/artifactsDb'
import { deployGoverRegistry } from '../../helpers/delploys'
import { setHRE } from '../../helpers/helpers'
import { eContractid } from '../../helpers/types'

const { GovernRegistry } = eContractid

task('deploy-registry', 'Deploys an GoverRegistry instance')
  .addFlag('verify', 'Verify the contracts via Etherscan API')
  .setAction(async ({ verify }, HRE) => {
    setHRE(HRE)
    const currentNetwork = HRE.network.name

    const governRegistry = await deployGoverRegistry(currentNetwork, verify)

    await registerContractInJsonDb(GovernRegistry, governRegistry)
  })
