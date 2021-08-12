import { configure, query } from '@aragon/govern'
import { subgraphURL } from './config'
import { utils } from 'ethers'

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
        daos {
          id
          token
          registrant
        }
      }
    `)

    expect(utils.isAddress(response.daos[0].token)).toEqual(true)
    expect(utils.isAddress(response.daos[0].registrant)).toEqual(true)
  })
})
