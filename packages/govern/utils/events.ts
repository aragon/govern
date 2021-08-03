import { Contract, providers, Signer } from 'ethers'

const registryAbi = [
  `event Registered(
        address indexed executor, 
        address queue, 
        address indexed token, 
        address minter, 
        address indexed registrant, 
        string name
    )`,
]

let currentRegistryAddress = null
let currentGovernRegistry = null

export function setUpRegisteredEvent(
  registryAddress: string,
  signer: providers.Provider | Signer,
  fn: Function,
  daoName: string
) {
  // if the registry hasn't changed, no need to register it again..
  //   if (currentRegistryAddress && currentRegistryAddress == registryAddress) {
  //     return
  //   }

  if (currentGovernRegistry) {
    // clean up previouse subscriptions
    const listeners = currentGovernRegistry.listeners('Registered')
    if (listeners.length) {
      listeners.forEach((listener) =>
        currentGovernRegistry.off('Registered', listener)
      )
    }
  }

  let GovernRegistry = null
  if (currentRegistryAddress !== registryAddress) {
    // start a new instance
    GovernRegistry = new Contract(registryAddress, registryAbi, signer)
    // set global variables
    currentGovernRegistry = GovernRegistry
    currentRegistryAddress = registryAddress
  } else {
    GovernRegistry = currentGovernRegistry
  }

  // start a new subscription
  GovernRegistry.on(
    'Registered',
    async (excecutor, queue, token, minter, registrant, name) => {
      // not our DAO, wait for next one
      if (name !== daoName) return
      // send back token address and excecutor
      fn(token, excecutor)
    }
  )
}
