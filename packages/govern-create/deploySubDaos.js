const { ethers } = require("ethers");
const ANDAOFactoryArtifacts = require("./artifacts/contracts/ANDAOsubFactory.sol/ANDAOFactory.json");
const CustomGovernTokenArtifacts = require("./artifacts/contracts/CustomGovernToken.sol/CustomGovernToken.json");

const provider = new ethers.providers.InfuraProvider("mainnet", "c6a4d4f3dfbd4f78825ad73083620404");
const wallet = new ethers.Wallet("", provider);
const signer = wallet.connect(provider);
const ANMainDAOAddress = '0x9c1d24318966793a68e6005eb6b27edace3f28b8'

async function deployToken(name, symbol) {
  const CustomGovernTokenFactory = new ethers.ContractFactory(
    CustomGovernTokenArtifacts.abi,
    CustomGovernTokenArtifacts.bytecode,
    signer
  );

  const token = await CustomGovernTokenFactory.deploy(
    ANMainDAOAddress,
    name,
    symbol,
    0
  );

  await token.deployed();

  console.log(name, token.address);
}

async function deployTokens() {
  await deployToken("ExecutiveCommitteeToken", "EXE");
  await deployToken("ComplianceCommitteeToken", "CMPL");
  await deployToken("TechCommitteeToken", "TECH");
}

async function deployANDAOFactory() {   
  const ANDAOFactoryFactory = new ethers.ContractFactory(
    ANDAOFactoryArtifacts.abi,
    ANDAOFactoryArtifacts.bytecode,
    signer
  )

  let ANDAOFactory = await ANDAOFactoryFactory.deploy(
    "0xf2b7d096cd34f228a6413e276132c21d98b19882", // GovernRegistry
    "0x6090afbdcf13b3a53323509955279ce0de4003a2", // GovernFactory
    "0x5d2d6a91c8b5fb62f2a6725eb791f412a5d39c4d", // GovernQueueFactory
    ANMainDAOAddress
  )
  await ANDAOFactory.deployed();

  console.log("ANDAOFactory Deployed:", ANDAOFactory.address)

  return ANDAOFactory;
}

async function deploySubDAOs(ANDAOFactory) {
    ANDAOFactory.on("SubDAOsDeployed", console.log)

    await ANDAOFactory.deployANSubDAOs()
}

async function deployFactoryAndSubDAOs() {
    const andaoFactory = await deployANDAOFactory();
    await deploySubDAOs(andaoFactory);
}


// SECOND
deployFactoryAndSubDAOs().catch(console.log);

// FIRST (AND ADD TOKEN ADDRESSES TO FACTORY CONTRACT AND COMPILE AGAIN)
//deployTokens().then(console.log).catch(console.log);
