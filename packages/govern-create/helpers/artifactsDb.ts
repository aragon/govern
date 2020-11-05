import { Contract } from 'ethers'
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import { BRE } from './helpers'
import { eContractid } from './types'

const adapter = new FileSync('./deployed-contracts.json')
export const getDb = () => low(adapter)

export const registerContractInJsonDb = async (
  contractId: eContractid,
  contractInstance: Contract
) => {
  const currentNetwork = BRE.network.name

  await getDb()
    .set(`${contractId}.${currentNetwork}`, {
      address: contractInstance.address,
      deployer: contractInstance.deployTransaction.from,
    })
    .write()
}
