import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

import { verifyContract } from '../utils/etherscan'

const ZERO_ADDR = `0x${'00'.repeat(20)}`
const TWO_ADDRR = `0x${'00'.repeat(19)}02`
const NO_TOKEN = `0x${'00'.repeat(20)}`

const dummyConfig = {
  executionDelay: '0',
  scheduleDeposit: [NO_TOKEN, '0'],
  challengeDeposit: [NO_TOKEN, '0'],
  resolver: ZERO_ADDR,
  rules: '0x',
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, ethers } = hre

  const governFactoryDeployment = await deployments.get('GovernFactory')
  const queueFactoryDeploymnet = await deployments.get('GovernQueueFactory')

  const governFactoryContract = await ethers.getContractAt(
    'GovernFactory',
    governFactoryDeployment.address
  )
  const queueFactoryContract = await ethers.getContractAt(
    'GovernQueueFactory',
    queueFactoryDeploymnet.address
  )

  const governBase = await governFactoryContract.base()
  const queueBase = await queueFactoryContract.base()

  console.log('Verifying factories base contracts')

  await verifyContract(governBase, [TWO_ADDRR])
  await verifyContract(queueBase, [TWO_ADDRR, dummyConfig])
}
export default func
func.runAtTheEnd = true
func.dependencies = [
  'GovernFactory',
  'GovernQueueFactory',
  'GovernTokenFactory',
  'GovernBaseFactory',
]
