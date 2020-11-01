import { configure, dao } from '../../public'

/**
 * dao e2e test
 */
describe('[e2e] dao Test', () => {
  beforeEach(() => {
    configure({ governURL: 'http://localhost:3000/' })
  })

  it('calls dao and returns as expected', async () => {
    const response = await dao("")

    expect(response.dao.address).toEqual('0x24319b199e9e3867ede90eaf0fad56168c54d077')
  })
})
