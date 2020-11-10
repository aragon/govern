import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import { HRE } from './helpers'
import { Address, eContractid } from './types'

const adapter = new FileSync('./deployed-contracts.json')
export const getDb = () => low(adapter)

export const registerContractInJsonDb = async (
  contractId: eContractid,
  contractAddress: Address
) => {
  const currentNetwork = HRE.network.name

  await getDb()
    .set(`${contractId}.${currentNetwork}`, {
      address: contractAddress,
    })
    .write()
}
