import { IGatewayDiscoveryParameters } from 'dvote-js'

type BrigeConfig = {
    [key:string]: IGatewayDiscoveryParameters
}

// TODO: update this to mainnet address or ens name, rinkeby address for now
export const DAO_FACTORY_ADDRESS = '0xB75290E69F83b52BfbF9C99B4Ae211935E75A851'
export const GOVERN_REGISTRY_ADDRESS = '0x7714e0a2a2da090c2bbba9199a54b903bb83a73d'

export const BRIGE_CONFIG: BrigeConfig = {
  rinkeby: {
    networkId: 'rinkeby',
    bootnodesContentUri: 'https://bootnodes.vocdoni.net/gateways.dev.json',
    environment: 'dev'
  },
  mainnet: {
    networkId: 'mainnet',
    bootnodesContentUri: 'https://bootnodes.vocdoni.net/gateways.json',
    environment: 'prod'
  }
}
