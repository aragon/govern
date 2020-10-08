const fetch = require('node-fetch')
const abi = require('web3-eth-abi')

const EAGLET_ABI = require('../artifacts/Eaglet.json').abi
const QUEUE_ABI = require('../artifacts/OptimisticQueue.json').abi

const RINKEBY_SUBGRAPH_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/evalir/aragon-eg-rinkeby-staging'

const SAMPLE_QUERY = `
{
  eaglets(first: 5) {
    id
    address
    queue {
      id
      config {
        executionDelay
        id
      }
    }
    roles {
      id
    }
  }
  optimisticQueues(first: 5) {
    id
    address
    eaglet {
      id
    }
    containers {
      id
    }
  }
}
`

function getFunctionABI(ABI, functionName) {
  const functionABI = ABI.find(
    (item) => item.type === 'function' && item.name === functionName
  )
  if (!functionABI)
    throw Error(`Could not find function ABI called ${functionName}`)
  return functionABI
}

function getStructParam(ABI, paramName) {
  const paramABI = ABI.find(
    (item) => item.type === 'tuple[]' && item.name === paramName
  )
  if (!paramABI)
    throw Error(`Could not find struct param ABI called ${paramName}`)
  return paramABI.components
}

function query(gqlQuery) {
  return fetch(RINKEBY_SUBGRAPH_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify({ query: gqlQuery })
  })
}

async function main(ethers) {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.getAddress());
  }

  const subgraphQuery = await query(SAMPLE_QUERY)
  const res = await subgraphQuery.json()
  console.log(res.data.eaglets, res.data.optimisticQueues)
}

module.exports = main
