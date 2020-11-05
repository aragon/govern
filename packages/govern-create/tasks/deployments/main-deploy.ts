import { task } from 'hardhat/config'
import { checkVerification } from '../../helpers/etherscan-verification'
import { setBRE, BRE } from '../../helpers/helpers'
import { logInfo } from '../../helpers/logger'

task('main-deploy', 'Full deployment flow on Main network')
  .addFlag('verify', 'Verify the contracts via Etherscan API')
  .setAction(async ({ verify }, _BRE) => {
    setBRE(_BRE)
    const { run } = BRE

    // Prevent loss of gas verifying all the needed ENVs for Etherscan verification
    if (verify) {
      checkVerification()
    }

    await run(`deploy-registry`, { verify })
    await run(`deploy-factory`, { verify })
    await run(`deploy-govern`, { verify })

    logInfo(`- Finished deployment at ${BRE.network.name} network.`)
  })
