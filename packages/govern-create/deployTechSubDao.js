const { ethers } = require("ethers");
const { LedgerSigner } = require("@ethersproject/hardware-wallets");
const TechSubDAOFactoryArtifacts = require("./artifacts/contracts/TechSubDAOFactory.sol/TechSubDAOFactory.json");

const provider = new ethers.providers.InfuraProvider("mainnet", process.env.ETHERSCAN_KEY);
//const signer = (new ethers.Wallet("", provider)).connect(provider);
const signer = new LedgerSigner(provider)

const ANMainDAOAddress = '0x9c1d24318966793a68e6005eb6b27edace3f28b8'

async function deployTechSubDAOFactory() {
  const TechSubDaoFactoryFactory = new ethers.ContractFactory(
    TechSubDAOFactoryArtifacts.abi,
    TechSubDAOFactoryArtifacts.bytecode,
    signer
  )

  let TechSubDaoFactory = await TechSubDaoFactoryFactory.deploy(
    "0xf2b7d096cd34f228a6413e276132c21d98b19882", // GovernRegistry
    "0x6090afbdcf13b3a53323509955279ce0de4003a2", // GovernFactory
    "0x5d2d6a91c8b5fb62f2a6725eb791f412a5d39c4d", // GovernQueueFactory
    ANMainDAOAddress,
    {
      maxFeePerGas: ethers.utils.parseUnits('120.0', 'gwei'),
      maxPriorityFeePerGas: ethers.utils.parseUnits('1.5', 'gwei'),
      gasLimit: 10000000
    }
  )
  await TechSubDaoFactory.deployed();

  console.log("TechSubDaoFactory Deployed:", TechSubDaoFactory.address)

  return TechSubDaoFactory;
}

async function deployTechSubDao(TechSubDaoFactory) {
    TechSubDaoFactory.on("SubDAOsDeployed", console.log)

    await TechSubDaoFactory.deployTechSubDao()
}

async function deployTechSubDaoFactoryAndTechSubDao() {
    const techSubDaoFactory = await deployTechSubDAOFactory();
    await deployTechSubDao(techSubDaoFactory);
}

async function printInfos() {
  blockNumber = await provider.getBlockNumber()
  feeData = await provider.getFeeData()
  address = await signer.getAddress()
  balance = await signer.getBalance()

  console.log(
    '\nBlock Number         : ' + blockNumber,
    '\nAddress              : ' + address,
    '\nBalance              : ' +ethers.utils.formatEther(balance) + ' ETH',
    '\nmaxFeePerGas         : ' + ethers.utils.formatUnits(feeData.maxFeePerGas, 'gwei') + ' gwei',
    '\nmaxPriorityFeePerGas : ' + ethers.utils.formatUnits(feeData.maxPriorityFeePerGas, 'gwei') + ' gwei',
    '\ngasPrice             : ' + ethers.utils.formatUnits(feeData.gasPrice, 'gwei') + ' gwei'
  )
}

printInfos()

deployTechSubDaoFactoryAndTechSubDao().catch(console.log);
