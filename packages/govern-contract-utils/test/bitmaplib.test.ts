import { expect } from 'chai'
import { ethers } from 'hardhat'
import {
  BitmapLibMock,
  BitmapLibMock__factory
} from '../typechain'

describe('Bitmap', function () {
  let lib: BitmapLibMock

  beforeEach(async () => {
    const BitmapLib = (await ethers.getContractFactory('BitmapLibMock')) as BitmapLibMock__factory
    lib = await BitmapLib.deploy()
  })

  it('flips', async () => {
    expect(await lib.flip(await lib.empty(), 1)).to.equal(`0x${'00'.repeat(31)}02`)
  })

  it('randomly flip and check', async () => {
    let map = []
    let bitmap = await lib.empty()

    for (let i = 0; i < 256; i++) {
      const bit = Math.random() >= 0.5
      map.push(bit)

      bitmap = bit ? await lib.flip(bitmap, i) : bitmap
    }

    for (let i = 0; i < 256; i++) {
      expect(await lib.get(bitmap, i)).to.equal(map[i])
    }
  })
})
