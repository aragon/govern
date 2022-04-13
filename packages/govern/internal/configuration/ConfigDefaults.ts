import { IGatewayDiscoveryParameters } from '@vocdoni/client'

type BrigeConfig = {
  [key: string]: IGatewayDiscoveryParameters
}

// TODO: update this to mainnet address or ens name, rinkeby address for now
export const DAO_FACTORY_ADDRESS = '0x91209b1352E1aD3abF7C7b74A899F3b118287f9D' //'0xB75290E69F83b52BfbF9C99B4Ae211935E75A851' //
export const GOVERN_REGISTRY_ADDRESS =
  '0x93731ce6db7f1ab978c722f3bcda494d12dcc0a1' //'0x7714e0a2a2da090c2bbba9199a54b903bb83a73d' //

export const BRIGE_CONFIG: BrigeConfig = {
  rinkeby: {
    networkId: 'rinkeby',
    bootnodesContentUri: 'https://bootnodes.vocdoni.net/gateways.dev.json',
    environment: 'dev',
    numberOfGateways: 1
  },
  mainnet: {
    networkId: 'mainnet',
    bootnodesContentUri: 'https://bootnodes.vocdoni.net/gateways.json',
    environment: 'prod',
    numberOfGateways: 1
  },
}
