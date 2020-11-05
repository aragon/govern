import { task } from 'hardhat/config'
import { setBRE, BRE } from '../../helpers/helpers'
import { logInfo } from '../../helpers/logger'

task('dev-deploy', 'Full deployment flow on hardhat network').setAction(
  async (_, _BRE) => {
    setBRE(_BRE)
    const { run } = BRE

    await run(`deploy-registry`)
    await run(`deploy-factory`)
    await run(`deploy-govern`)

    logInfo(`- Finished deployment at ${BRE.network.name} network.`)
  }
)
