import {  BigInt } from '@graphprotocol/graph-ts'

export function toMs(time: BigInt) : BigInt {
    return time.times(BigInt.fromI32(1000))
}