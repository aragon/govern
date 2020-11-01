import { configure, query } from '../../public'

/**
 * query e2e test
 */
describe('[e2e] query Test', () => {
  beforeEach(() => {
    configure({ governURL: 'http://localhost:3000/' })
  })

  it('calls query and returns as expected', async () => {
    const response = await query(`
      query DAOS {
        daos {
          id
          address
          metadata
        }
      }
    `)

    expect(response.daos[0].address).toEqual('0x24319b199e9e3867ede90eaf0fad56168c54d077')
  })
})
