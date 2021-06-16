// Library utils (Ethers currently)
import { utils, BigNumberish, ethers } from 'ethers';

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

// example: formatUnits(100, 3) = 0.1
export function formatUnits(amount: BigNumberish, decimals: number) {
  if (amount.toString().includes('.') || !decimals) {
    return amount.toString();
  }
  return ethers.utils.formatUnits(amount, decimals);
}

// example: parseUnits(100, 3) = 100000
export function parseUnits(amount: BigNumberish, decimals: number) {
  return ethers.utils.parseUnits(amount.toString(), decimals);
}
