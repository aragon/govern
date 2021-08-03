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

// let currentRegistryAddress = null
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

  let GovernRegistry =
    currentGovernRegistry || new Contract(registryAddress, registryAbi, signer)

  currentGovernRegistry = GovernRegistry

  //   currentRegistryAddress = registryAddress

  const listeners = GovernRegistry.listeners('Registered')
  if (listeners.length) {
    // clean previouse listeners
    listeners.forEach((listener) => GovernRegistry.off('Registered', listener))
  }
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
