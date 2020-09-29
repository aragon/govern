const { expect } = require('chai')

const ERRORS = {
  AUTH: 'acl: auth',
  FROZEN: 'acl: frozen'
}

const EVENTS = {
  GRANTED: 'Granted',
  REVOKED: 'Revoked',
  FROZEN: 'Frozen'
}

const ROLE = '0xabcdabcd'

describe.only('MiniACL', function () {
  let signers, root, acl, aclNotRoot

  before(async () => {
    signers = await ethers.getSigners()
    root = await signers[0].getAddress()
    notRoot = await signers[1].getAddress()
  })

  beforeEach(async () => {
    const MiniACL = await ethers.getContractFactory('MiniACL')
    acl = await MiniACL.deploy(root)
    aclNotRoot = await acl.connect(signers[1])
  })

  const grant = (inst, role = ROLE, who = notRoot) => inst.grant(role, who)
  const revoke = (inst, role = ROLE, who = notRoot) => inst.revoke(role, who)

  const assertRole = async (shouldHaveRole = true, role = ROLE, who = notRoot) =>
    expect(await acl.roles(role, who)).to.equal(shouldHaveRole)

  it('non-root cannot grant', async () => {
    await expect(grant(aclNotRoot)).to.be.revertedWith(ERRORS.AUTH)
  })

  context('granting', async () => {
    beforeEach('root grants', async () => {
      await assertRole(false)
      await expect(grant(acl))
        .to.emit(acl, EVENTS.GRANTED)
        .withArgs(ROLE, root, notRoot)
    })

    it('role is granted', async () => {
      await assertRole(true)
    })

    it('root can revoke', async () => {
      await expect(revoke(acl))
        .to.emit(acl, EVENTS.REVOKED)
        .withArgs(ROLE, root, notRoot)
      await assertRole(false)
    })

    it('non-root cannot revoke', async () => {
      await expect(revoke(aclNotRoot)).to.be.revertedWith(ERRORS.AUTH)
    })
  })
})
