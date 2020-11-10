import { task } from 'hardhat/config'
import { setHRE, HRE } from '../../helpers/helpers'
import { logInfo } from '../../helpers/logger'

task('dev-deploy', 'Full deployment flow on hardhat network').setAction(
  async (_, _HRE) => {
    setHRE(_HRE)
    const { run } = HRE

    await run(`deploy-registry`)
    await run(`deploy-factory`)
    await run(`deploy-govern`)

    logInfo(`- Finished deployment at ${HRE.network.name} network.`)
  }
)
