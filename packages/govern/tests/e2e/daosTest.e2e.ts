import { configure, daos } from '@aragon/govern'

/**
 * daos e2e test
 */
describe('[e2e] daos Test', () => {
  beforeEach(() => {
    configure({ governURL: 'http://localhost:3000/' })
  })

  it('calls daos and returns as expected', async () => {
    const response = await daos()

    expect(response[0].address).toEqual('0x24319b199e9e3867ede90eaf0fad56168c54d077')
  })
})
