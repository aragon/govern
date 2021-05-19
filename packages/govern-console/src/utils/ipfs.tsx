import CID from 'cids';
import { toUTF8String } from 'utils/lib';
import { IPFS_GATEWAY } from './constants';
import IPFS from 'ipfs-core';

let ipfs: any = null;

export async function addToIpfs(file: any) {
  if (!ipfs) {
    ipfs = await IPFS.create();
  }

  const { cid } = await ipfs.add(file);

  const cidBytes = cid.toV1().bytes;

  return cidBytes;
}

/**
 * checks with different combinations if the passed string is cid
 *
 * @param uriOrCid Cid or the complete uri of ipfs
 * @returns {string|null} cid if it's the actual cid or null
 */
export function getIpfsCid(uriOrCid: string) {
  const cidString = uriOrCid.replace(/^ipfs:/, '');
  // if cidString can be passed to CID class without throwing
  // it means it's the actual cid
  try {
    new CID(cidString);
    return cidString;
  } catch (err) {}

  // if cidString is ipfs v1 version hex from the cid's raw bytes and
  // we add `f` as a multibase prefix and remove `0x`
  try {
    const cid = `f${cidString.substring(2)}`;
    new CID(cid);
    return cid;
  } catch (err) {}

  // if cidString is ipfs v0 version hex from the cid's raw bytes,
  // we add:
  // 1. 112 (0x70 in hex) which is dag-pb format.
  // 2. 01 because we want to use v1 version
  // 3. f since cidString is already hex, we only add `f` without converting anything.
  try {
    const cid = `f0170${cidString.substring(2)}`;
    new CID(cid);
    return cid;
  } catch (err) {}

  // if cidString is hex received from string-to-hex converter
  try {
    const cid = toUTF8String(cidString) || cidString;
    // eslint-disable-next-line no-new
    new CID(cid);
    return cid;
  } catch (err) {}

  return null;
}

/**
 * @param uriOrCid Cid or the complete uri of ipfs
 *
 * @returns {string} the gateway url of the cid
 */
export function getIpfsUrl(uriOrCid: string) {
  let cid: string | null = uriOrCid.replace(/^ipfs:/, '');
  cid = getIpfsCid(cid);

  return cid ? `${IPFS_GATEWAY}/${cid}` : null;
}
