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

let governRegistryInstance = null

export function setUpRegisteredEvent(
    registryAddress: string, 
    signer: providers.Provider | Signer, 
    fn: Function, 
    daoName: string
) {
    if (governRegistryInstance) {
        governRegistryInstance.removeAllListeners('Registered');
    }

    if (governRegistryInstance?.address !== registryAddress || governRegistryInstance == null) {
        governRegistryInstance = new Contract(registryAddress, registryAbi, signer)
    }

    // start a new subscription
    governRegistryInstance.on(
        'Registered',
        async (excecutor, queue, token, minter, registrant, name) => {
        // not our DAO, wait for next one
        if (name !== daoName) return
        // send back token address and excecutor
        fn(token, excecutor)
        }
    )
}
