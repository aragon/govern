const fs = require("fs");

const KNOWN_ABIS = [
  "Eaglet.json",
  "EagletFactory.json",
  "ERC3000Registry.json",
  "OptimisticQueue.json",
  "OptimisticQueueFactory.json",
];

async function main() {
  KNOWN_ABIS.map((abiName) => {
    console.log(`Syncing ${abiName}`);
    console.log(fs.existsSync(`artifacts/${abiName}`), `found ${abiName}`);
    const rawAbiFile = fs.readFileSync(`artifacts/${abiName}`);
    const parsedAbiFile = JSON.parse(rawAbiFile);
    const abiContent = parsedAbiFile.abi;

    const stringifiedAbi = JSON.stringify(abiContent);
    fs.writeFileSync(`../govern-subgraph/abis/${abiName}`, stringifiedAbi);
  });

  console.log("All ABIs synced!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
