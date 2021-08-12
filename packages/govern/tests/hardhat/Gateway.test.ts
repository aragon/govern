import { getPool } from '../../internal/actions/lib/Gateway'
import { providers } from 'ethers'
import { expect } from 'chai'

describe('GatewayTest', function () {
  it('getPool with provider should work', async function () {
    const provider = new providers.InfuraProvider('rinkeby')
    const pool = await getPool(provider)
    expect(pool).to.have.property('isReady')
  })

  it('getPool without provider should work', async function () {
    const pool = await getPool()
    expect(pool).to.have.property('isReady')
  })
})
