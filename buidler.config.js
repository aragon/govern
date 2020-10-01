usePlugin("solidity-coverage");
usePlugin("@nomiclabs/buidler-ethers");
usePlugin("@nomiclabs/buidler-etherscan");
usePlugin("@nomiclabs/buidler-waffle");

task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.getAddress());
  }
});

task("deploy", "Deploys an eaglet instance").setAction(
  async (_, { ethers }) => {
    const optimisticQueueFactory = await ethers.getContractFactory(
      "OptimisticQueueFactory"
    );
    const eagletFactory = await ethers.getContractFactory("EagletFactory");

    const queueFactoryTx = await optimisticQueueFactory.deploy();
    console.log("queueFactory deployed: ", queueFactoryTx.address);

    const eagletFactoryTx = await eagletFactory.deploy(queueFactoryTx.address);
    console.log("eagletFactory deployed: ", eagletFactoryTx.address);

    console.log("Done!");
  }
);

const ETH_KEY = process.env.ETH_KEY;

module.exports = {
  // This is a sample solc configuration that specifies which version of solc to use
  solc: {
    version: "0.6.8",
    optimizer: {
      enabled: true,
      runs: 2000     // TODO: target average DAO use
    }
  },
  etherscan: {
    apiKey: "",
  },
  networks: {
    coverage: {
      url: "http://localhost:8555",
    },
    rinkeby: {
      url: "https://rinkeby.eth.aragon.network",
      accounts: ETH_KEY
        ? ETH_KEY.split(",")
        : [
            "",
          ],
    },
  },
};
