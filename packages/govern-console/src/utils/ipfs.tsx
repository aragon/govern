/* eslint-disable */
import CID from 'cids'
import { toUtf8String } from '@ethersproject/strings';

export const getIpfsCidFromUri = (uri: string) => {
    const cidString = uri.replace(/^ipfs:/, '')
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
    

    return null
}