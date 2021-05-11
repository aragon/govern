/* eslint-disable */
import CID from 'cids'
import { toUtf8String } from '@ethersproject/strings';
import { IPFS_GATEWAY} from './constants'

/**
 * @param uriOrCid Cid or the complete uri of ipfs
 * 
 * @returns {string} the gateway url of the cid
 */
export const getIpfsURI = (uriOrCid: string) => {
    const cid = uriOrCid.replace(/^ipfs:/, '')
    return `${IPFS_GATEWAY}/${cid}`
}


/**
 * checks with different combinations if the passed string is cid
 * 
 * @param uriOrCid Cid or the complete uri of ipfs
 * @returns {string|null} cid if it's the actual cid or null
 */
export const getIpfsCid = (uriOrCid: string) => {
    const cidString = uriOrCid.replace(/^ipfs:/, '')
    // if cidString can be passed to CID class without throwing
    // it means it's the actual cid
    try {
        // eslint-disable-next-line no-new
        new CID(cidString)
        return cidString
    } catch (err) { }

    // if cidString is hex from the cid's raw bytes.
    // we add `f` as a multibase prefix and remove `0x`
    try {
        const cid = `f${cidString.substring(2)}`
        // eslint-disable-next-line no-new
        new CID(cid)
        return cid
    } catch (err) { }

    // if cidString is hex received from string-to-hex converter 
    try {
        const cid = toUtf8String(cidString)
        // eslint-disable-next-line no-new
        new CID(cid)
        return cid
    } catch (err) { }
       
}