import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { network, ethers } from 'hardhat'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const registry = await deployments.get('GovernRegistry')

  const governFactory = await deploy('GovernFactory', {
    from: deployer,
    log: true,
    // deterministicDeployment: true,
  })

  const queueFactory = await deploy('GovernQueueFactory', {
    from: deployer,
    log: true,
    // deterministicDeployment: true,
  })

  const tokenFactory = await deploy('GovernTokenFactory', {
    from: deployer,
    log: true,
    // deterministicDeployment: true,
  })
   
    
    const token = await deploy('GovernToken', {
      from: deployer,
      args: [
        tokenFactory.address,
        "GovernToken base",
        "GTB",
        0
      ],
      log: true,
      // deterministicDeployment: true,
    })
  
    const merkelDistributor = await deploy('MerkleDistributor', {
      from: deployer,
      log: true
    })
  
    const minter = await deploy('GovernMinter', {
      from: deployer,
      args: [
        token.address,
        tokenFactory.address,
        merkelDistributor.address
      ]
    })

    try {
      const tokenFactoryInstance = (await ethers.getContractFactory('GovernTokenFactory')).attach(tokenFactory.address);
      await tokenFactoryInstance.setupBases(merkelDistributor.address,
        minter.address,
        token.address)
    } catch (error) {
      console.log(error);
    }  


  await deploy('GovernBaseFactory', {
    from: deployer,
    args: [
      registry.address,
      governFactory.address,
      queueFactory.address,
      tokenFactory.address,
    ],
    log: true,
    // deterministicDeployment: true,
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
