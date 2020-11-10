import { expect } from 'chai'
import { ethers } from 'hardhat'
import { Signer } from 'ethers'
import {
  Acl,
  AclFactory
} from '../typechain'

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
const NO_ROLE = '0x0000000000000000000000000000000000000000'
const ALLOW_ROLE = '0x0000000000000000000000000000000000000002'
const FREEZE_ADDR = '0x0000000000000000000000000000000000000001'

describe('ACL', function () {
  let signers: Signer[]
  let root: string
  let notRoot: string
  let acl: Acl
  let aclNotRoot: Acl

  before(async () => {
    signers = await ethers.getSigners()
    root = await signers[0].getAddress()
    notRoot = await signers[1].getAddress()
  })

  beforeEach(async () => {
    const ACL = (await ethers.getContractFactory('ACL')) as AclFactory
    acl = await ACL.deploy(root)
    aclNotRoot = await acl.connect(signers[1])
  })

  const grant = (inst: Acl, role = ROLE, who = notRoot) => inst.grant(role, who)
  const revoke = (inst: Acl, role = ROLE, who = notRoot) => inst.revoke(role, who)
  const freeze = (inst: Acl, role = ROLE) => inst.freeze(role)

  const assertRole = async (shouldHaveRole = true, role = ROLE, who = notRoot) =>
    expect(await acl.roles(role, who)).to.equal(shouldHaveRole ? ALLOW_ROLE : NO_ROLE)

  context('granting', async () => {
    beforeEach('root grants', async () => {
      await assertRole(false)
      await expect(grant(acl))
        .to.emit(acl, EVENTS.GRANTED)
        .withArgs(ROLE, root, notRoot, ALLOW_ROLE)
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
        expect(await acl.roles(ROLE, FREEZE_ADDR)).to.equal(FREEZE_ADDR)
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
    let ROOT_ROLE: string

    beforeEach(async () => {
      ROOT_ROLE = await acl.ROOT_ROLE()

      await assertRole(false, ROOT_ROLE, notRoot)
      await expect(grant(acl, ROOT_ROLE))
        .to.emit(acl, EVENTS.GRANTED)
        .withArgs(ROOT_ROLE, root, notRoot, ALLOW_ROLE)
      await assertRole(true, ROOT_ROLE, notRoot)
    })

    it('can re-grant', async () => {
      const someoneElse = await signers[2].getAddress()
      await expect(grant(aclNotRoot, ROOT_ROLE, someoneElse))
        .to.emit(acl, EVENTS.GRANTED)
        .withArgs(ROOT_ROLE, notRoot, someoneElse, ALLOW_ROLE)
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

  context('ACL.bulk', () => {
    it('Grant', async () => {
      await expect(acl.bulk([
        {
          op: 0,
          role: ROLE,
          who: notRoot
        }
      ])).to.emit(acl, EVENTS.GRANTED)

      await assertRole(true, ROLE, notRoot)
    })

    it('Revoke', async () => {
      await expect(acl.bulk([
        {
          op: 1,
          role: ROLE,
          who: notRoot
        }
      ])).to.emit(acl, EVENTS.REVOKED)

      await assertRole(false, ROLE, notRoot)
    })

    it('Freeze', async () => {
      await expect(acl.bulk([
        {
          op: 2,
          role: ROLE,
          who: '0x0000000000000000000000000000000000000000'
        }
      ])).to.emit(acl, EVENTS.FROZEN)

      expect(await acl.roles(ROLE, FREEZE_ADDR))
        .to.equal(FREEZE_ADDR)
    })
  })
})
