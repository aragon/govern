const { ethers, BigNumber } = require('ethers')
const { LedgerSigner } = require('@ethersproject/hardware-wallets')
const TechSubDAOFactoryArtifacts = require('./artifacts/contracts/TechSubDAOFactory.sol/TechSubDAOFactory.json')

const provider = new ethers.providers.InfuraProvider('rinkeby', 'c6a4d4f3dfbd4f78825ad73083620404')
const signer = (new ethers.Wallet('', provider)).connect(provider);
//const signer = new LedgerSigner(provider)

async function printInfos() {
  blockNumber = await provider.getBlockNumber()
  feeData = await provider.getFeeData()
  address = await signer.getAddress()
  balance = await signer.getBalance()

  console.log(
    '\nBlock Number         : ' + blockNumber,
    '\nAddress              : ' + address,
    '\nBalance              : ' + ethers.utils.formatEther(balance) + ' ETH',
    '\nmaxFeePerGas         : ' + ethers.utils.formatUnits(feeData.maxFeePerGas, 'gwei') + ' gwei',
    '\nmaxPriorityFeePerGas : ' + ethers.utils.formatUnits(feeData.maxPriorityFeePerGas, 'gwei') + ' gwei',
    '\ngasPrice             : ' + ethers.utils.formatUnits(feeData.gasPrice, 'gwei') + ' gwei'
  )
}

const options = {
  maxFeePerGas: ethers.utils.parseUnits('50.0', 'gwei'),
  maxPriorityFeePerGas: ethers.utils.parseUnits('1.5', 'gwei'),
  gasLimit: ethers.BigNumber.from(1.5 * 10 ** 6)
}
const transactionPrice = ethers.utils.formatEther(options.gasLimit.mul(options.maxFeePerGas))

console.log(`Make sure to have ${transactionPrice} ETH in your wallet for each of the two transaction.`)

async function deployTechSubDAOFactory() {
  const TechSubDaoFactoryFactory = new ethers.ContractFactory(
    TechSubDAOFactoryArtifacts.abi,
    TechSubDAOFactoryArtifacts.bytecode,
    signer,
    options
  )

  let TechSubDaoFactory = await TechSubDaoFactoryFactory.deploy(
    '0xf2b7D096cd34F228A6413e276132C21D98b19882', // GovernRegistry
    '0x6090AfBDCF13b3a53323509955279Ce0De4003a2', // GovernFactory
    '0x5d2d6A91c8b5fB62f2A6725eb791f412A5d39C4d', // GovernQueueFactory
    '0x9C1d24318966793A68e6005eB6B27EDacE3f28B8', // ANMainDAOAddress
    options
  )
  await TechSubDaoFactory.deployed()

  console.log('TechSubDaoFactory Deployed:', TechSubDaoFactory.address)

  return TechSubDaoFactory
}

async function deployTechSubDao(TechSubDaoFactory) {
  TechSubDaoFactory.on('TechSubDAODeployed', console.log)

  await TechSubDaoFactory.deployTechSubDao(options)
}

async function deployTechSubDaoFactoryAndTechSubDao() {
  const techSubDaoFactory = await deployTechSubDAOFactory()
  await deployTechSubDao(techSubDaoFactory)
}


printInfos()
//deployTechSubDaoFactoryAndTechSubDao().catch(console.log);
