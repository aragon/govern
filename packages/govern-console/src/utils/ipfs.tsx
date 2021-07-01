import CID from 'cids';
import { toUTF8String } from 'utils/lib';
import { IPFS_GATEWAY } from './constants';
import { create } from 'ipfs-http-client';
import { ipfsMetadata } from 'utils/types';

let ipfs: any = null;

const FILE_EXTS = {
  text: 'txt',
};

const MIME_TYPES = ['text/plain'];

function createIpfs() {
  if (!ipfs) {
    ipfs = create({
      url: 'https://2a7143fae39e7adaeb57.b-cdn.net/api/v0',
      headers: {
        authorization: 'v2 z7fAEdRSjqiH7Qv8ez2Qs6gypd5v3YH8cPGEE9MyESMVb',
      },
    });
  }
}

export async function addToIpfs(data: HTMLInputElement | string, metadata: any = null) {
  createIpfs();

  const ipfsFilePath = `/aragon/blob${typeof data === 'string' ? '.' + FILE_EXTS.text : ''}`;
  const ipfsMetadataPath = '/aragon/metadata.json';

  if (metadata == null) {
    const { cid } = await ipfs.add({
      path: ipfsFilePath,
      content: data,
    });
    const cidBytes = cid.toV1().bytes;
    return cidBytes;
  }

  const files = [
    {
      path: ipfsFilePath,
      content: data,
    },
    {
      path: ipfsMetadataPath,
      content: JSON.stringify(metadata),
    },
  ];

  for await (const result of ipfs.addAll(files)) {
    if (result.path === 'aragon') {
      const cidBytes = result.cid.toV1().bytes;
      return cidBytes;
    }
  }
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

export async function fetchIPFS(uriOrCid: string) {
  createIpfs();

  let cid: string | null = uriOrCid.replace(/^ipfs:/, '');
  cid = getIpfsCid(cid);
  if (!cid) {
    return null;
  }

  const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';

  // endpoint/text can be array for supporting multiple files
  const data: ipfsMetadata = {
    metadata: null,
    endpoint: null,
    text: null,
    error: null,
  };

  for await (const file of ipfs.get(cid)) {
    // If the file type is dir, it's a directory,
    // so we need inside files
    if (file.type === 'dir') {
      continue;
    }

    if (file.type === 'file') {
      const content: any = [];

      for await (const chunk of file.content) {
        content.push(chunk);
      }

      const buffer = Buffer.concat(content);

      if (file.path.includes('metadata')) {
        try {
          data.metadata = JSON.parse(new TextDecoder().decode(buffer));
        } catch (err) {}
      } else {
        data.endpoint = IPFS_GATEWAY + file.path;

        const extension = file.path.split('.').pop();
        // check if the extension exists and is of type `.txt`
        // to get the text representation by saving bandwith.
        if (Object.values(FILE_EXTS).includes(extension)) {
          try {
            data.text = new TextDecoder().decode(buffer);
          } catch (err) {}
        }
        // if the path name doesn't have .txt extension
        // or doesn't include path at all, fetch is needed
        // to determine the type and gets its text if it's text/plain
        else {
          const response = await fetch(IPFS_GATEWAY + file.path);
          if (!response.ok) {
            data.error = !response.ok;
            return data;
          }

          const blob = await response.clone().blob();

          if (MIME_TYPES.includes(blob.type)) {
            try {
              data.text = new TextDecoder().decode(buffer);
            } catch (err) {}
          }
        }
      }
    }
  }

  return data;
}
