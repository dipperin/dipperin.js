import createKeccakHash from 'keccak'
import { isNumber, isBuffer, isString } from 'lodash'

export const keccak256 = (bits: string | number | any[] | Buffer): string => {
  const data = parseFromHex(bits)
  return `0x${createKeccakHash('keccak256')
    .update(data)
    .digest('hex')}`
}

export const keccak512 = (bits: string | number | any[] | Buffer): string => {
  const data = parseFromHex(bits)
  return `0x${createKeccakHash('keccak512')
    .update(data)
    .digest('hex')}`
}

export const parseFromHex = (
  bits: string | number | any[] | Buffer
): any[] | string | Buffer => {
  if (isNumber(bits)) {
    return Buffer.from(
      bits
        .toString(16)
        .match(/\w{2}/g)
        .map(v => parseInt(v, 16))
    )
  } else if (isBuffer(bits)) {
    return bits
  } else if (!Array.isArray(bits) && isString(bits) && bits.includes('0x')) {
    return Buffer.from(
      bits
        .slice(2)
        .match(/\w{2}/g)
        .map(v => {
          return parseInt(v, 16)
        })
    )
  } else if (Array.isArray(bits)) {
    return Buffer.from(bits)
  } else {
    return bits
  }
}

export default {
  keccak256,
  keccak512
}
