import { task } from 'hardhat/config'
import { checkVerification } from '../../helpers/etherscan-verification'
import { setHRE, HRE } from '../../helpers/helpers'
import { logInfo } from '../../helpers/logger'

task('rinkeby-deploy', 'Full deployment flow on Rinkeby network')
  .addFlag('verify', 'Verify the contracts via Etherscan API')
  .setAction(async ({ verify }, _HRE) => {
    setHRE(_HRE)
    const { run } = HRE

    // Prevent loss of gas verifying all the needed ENVs for Etherscan verification
    if (verify) {
      checkVerification()
    }

    await run(`deploy-registry`, { verify })
    await run(`deploy-factory`, { verify })
    await run(`deploy-govern`, { verify })

    logInfo(`- Finished deployment at ${HRE.network.name} network.`)
  })
