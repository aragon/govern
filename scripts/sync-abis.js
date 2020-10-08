const fs = require('fs')

const KNOWN_ABIS = [
  'Eaglet.json',
  'EagletFactory.json',
  'ERC3000Registry.json',
  'OptimisticQueue.json',
  'OptimisticQueueFactory.json',
]

const BUIDLER_PATH = 'packages/govern/artifacts/'
const ERC3K_PATH = 'packages/erc3kjs/src/lib/abi/'
const GOVERN_SUBGRAPH_PATH = 'packages/govern-subgraph/abis/'

async function main() {
  KNOWN_ABIS.map((abiName) => {
    console.log(`Syncing ${abiName}`)
    const existsInSubgraph = fs.existsSync(`${GOVERN_SUBGRAPH_PATH}${abiName}`)
    const existsInErc3k = fs.existsSync(`${ERC3K_PATH}${abiName}`)

    console.log(
      `${
        existsInSubgraph ? `Found` : `Didn't find`
      } ${abiName} in govern-subgraph`
    )
    console.log(
      `${existsInErc3k ? `Found` : `Didn't find`} ${abiName} in erc3kjs`
    )
    console.log('\n')

    const rawAbiFile = fs.readFileSync(`${BUIDLER_PATH}${abiName}`)
    const parsedAbiFile = JSON.parse(rawAbiFile)
    const abiContent = parsedAbiFile.abi

    const stringifiedAbi = JSON.stringify(abiContent)

    existsInSubgraph
      ? fs.writeFileSync(`${GOVERN_SUBGRAPH_PATH}${abiName}`, stringifiedAbi)
      : fs.appendFileSync(`${GOVERN_SUBGRAPH_PATH}${abiName}`, stringifiedAbi)
    console.log(
      `Successfully wrote contents to ${GOVERN_SUBGRAPH_PATH}${abiName}`
    )

    existsInErc3k
      ? fs.writeFileSync(`${ERC3K_PATH}${abiName}`, stringifiedAbi)
      : fs.appendFileSync(`${ERC3K_PATH}${abiName}`, stringifiedAbi)
    console.log(`Successfully wrote contents to ${ERC3K_PATH}${abiName}`)
    console.log('\n')
  })

  console.log('All ABIs synced!')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
