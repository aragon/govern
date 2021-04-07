import { configure, query } from '@aragon/govern'
import { subgraphURL } from './config'
import { ethers } from 'ethers'

/**
 * query e2e test
 */
describe('[e2e] query Test', () => {
  beforeEach(() => {
    configure({ subgraphURL })
  })

  it('calls query and returns as expected', async () => {
    const response = await query(`
      query DAOS {
        daos: governs {
          id
          address
          metadata
        }
      }
    `)

    expect(ethers.utils.isAddress(response.daos[0].address)).toEqual(true)
  })
})
