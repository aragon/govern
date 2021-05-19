// Library utils (Ethers currently)
import { utils } from 'ethers';

const { toUtf8String, toUtf8Bytes } = utils;

export function toUTF8String(data: utils.BytesLike): string | null {
  try {
    return toUtf8String(data);
  } catch (err) {
    return null; // can't be decoded
  }
}

export function toUTF8Bytes(data: string): utils.BytesLike | null {
  try {
    return toUtf8Bytes(data);
  } catch (err) {
    return null; // can't be decoded
  }
}
