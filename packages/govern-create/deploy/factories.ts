import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const registry = await deployments.get('GovernRegistry')

  const governFactory = await deploy('GovernFactory', {
    from: deployer,
    log: true,
    deterministicDeployment: true,
  })

  const queueFactory = await deploy('GovernQueueFactory', {
    from: deployer,
    log: true,
    deterministicDeployment: true,
  })

  const tokenFactory = await deploy('GovernTokenFactory', {
    from: deployer,
    log: true,
    deterministicDeployment: true,
  })

  await deploy('GovernBaseFactory', {
    from: deployer,
    args: [
      registry.address,
      governFactory.address,
      queueFactory.address,
      tokenFactory.address,
    ],
    log: true,
    deterministicDeployment:true
  })

}
export default func
func.tags = [
  'GovernFactory',
  'GovernQueueFactory',
  'GovernTokenFactory',
  'GovernBaseFactory',
]
func.dependencies = ['GovernRegistry']
