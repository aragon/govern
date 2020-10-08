const { expect } = require('chai')

const ERRORS = {
  AUTH: 'acl: auth',
  FROZEN: 'acl: frozen',
  BAD_FREEZE: 'acl: bad freeze'
}

const EVENTS = {
  GRANTED: 'Granted',
  REVOKED: 'Revoked',
  FROZEN: 'Frozen'
}

const ROLE = '0xabcdabcd'
const FREEZE_ADDR = '0x0000000000000000000000000000000000000001'

describe('MiniACL', function () {
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
  const freeze = (inst, role = ROLE) => inst.freeze(role)

  const assertRole = async (shouldHaveRole = true, role = ROLE, who = notRoot) =>
    expect(await acl.roles(role, who)).to.equal(shouldHaveRole)

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

    context('freezing', () => {
      beforeEach(async () => {
        await assertRole(true)
        await expect(freeze(acl))
          .to.emit(acl, EVENTS.FROZEN)
          .withArgs(ROLE, root)
      })

      it('role is granted to freeze addr', async () => {
        await assertRole(true, ROLE, FREEZE_ADDR)
      })
  
      it('cannot grant', async () => {
        await expect(grant(acl)).to.be.revertedWith(ERRORS.FROZEN)
      })
  
      it('cannot revoke', async () => {
        await expect(revoke(acl)).to.be.revertedWith(ERRORS.FROZEN)
      })
  
      it('cannot freeze', async () => {
        await expect(freeze(acl)).to.be.revertedWith(ERRORS.FROZEN)
      })
    })
  })

  context('granting root role', () => {
    let ROOT_ROLE

    beforeEach(async () => {
      ROOT_ROLE = await acl.ROOT_ROLE()

      await assertRole(false, ROOT_ROLE, notRoot)
      await expect(grant(acl, ROOT_ROLE))
        .to.emit(acl, EVENTS.GRANTED)
        .withArgs(ROOT_ROLE, root, notRoot)
      await assertRole(true, ROOT_ROLE, notRoot)
    })

    it('can re-grant', async () => {
      const someoneElse = await signers[2].getAddress()
      await expect(grant(aclNotRoot, ROOT_ROLE, someoneElse))
        .to.emit(acl, EVENTS.GRANTED)
        .withArgs(ROOT_ROLE, notRoot, someoneElse)
      await assertRole(true, ROOT_ROLE, someoneElse)
    })

    it('can lock root out', async () => {
      await revoke(acl, ROOT_ROLE, root)
      await expect(grant(acl)).to.be.revertedWith(ERRORS.AUTH)
    })
  })

  context('basic auth', () => {
    it('non-root cannot grant', async () => {
      await expect(grant(aclNotRoot)).to.be.revertedWith(ERRORS.AUTH)
    })
  
    it('non-root cannot revoke', async () => {
      await expect(revoke(aclNotRoot)).to.be.revertedWith(ERRORS.AUTH)
    })
  
    it('non-root cannot freeze', async () => {
      await expect(freeze(aclNotRoot)).to.be.revertedWith(ERRORS.AUTH)
    })
  })

  it('root cannot freeze by granting', async () => {
    await expect(grant(acl, ROLE, FREEZE_ADDR)).to.be.revertedWith(ERRORS.BAD_FREEZE)
  })
})
