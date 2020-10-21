export type Dao = { address: string }

const DAOS = [
  { address: '0xcafe' },
  { address: '0xbeef' },
  { address: '0xface' },
  { address: '0xbead' },
] as Dao[]

export async function daos(): Promise<Dao[]> {
  return DAOS
}

export async function dao(address: string): Promise<Dao | null> {
  return DAOS.find((dao) => dao.address === address) ?? null
}
