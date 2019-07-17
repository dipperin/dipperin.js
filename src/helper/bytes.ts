import BN from 'bignumber.js'

/**
 * Get the byte at the specified position in bytes
 *
 * @param bytes
 * @param index
 */
const at = (bytes: string, index: number): number => {
  return parseInt(bytes.slice(index * 2 + 2, index * 2 + 4), 16)
}

/**
 * Get the length of bytes
 *
 * @param bytes
 */
const length = (bytes: string): number => (bytes.length - 2) / 2

/**
 * Transfrom bytes array to bytes string
 *
 * @param bytesArray
 */
const flatten = (bytesArray: string[]): string =>
  bytesArray.reduce((r, v) => r + v.slice(2), '0x')

/**
 * Get the specified length of bytes from the specified bytes
 *
 * @param start
 * @param end
 * @param bytes
 */
const slice = (start: number, end: number, bytes: string): string =>
  `0x${bytes.slice(start * 2 + 2, end * 2 + 2)}`

/**
 * Reverse the specified bytes
 *
 * @param bytes
 */
const reverse = (bytes: string): string => {
  return `0x${bytes
    .slice(2)
    .match(/\w{2}/g)
    .reverse()
    .join('')}`
}

/**
 * Fill the left of Bytes with a specific number of zeros
 *
 * @param len
 * @param bytes
 */
const pad = (len: number, bytes: string): string =>
  `0x${bytes.slice(2).padStart(len * 2, '0')}`

/**
 * Fill the right of Bytes with a specific number of zeros
 *
 * @param len
 * @param hex
 */
const padRight = (len: number, hex: string): string =>
  hex.padEnd(len * 2 + 2, '0')

/**
 * Transfrom bytes to bytes string array
 *
 * @param bytes
 */
const toArray = (bytes: string): number[] =>
  bytes
    .slice(2)
    .match(/\w{2}/g)
    .map(bit => parseInt(bit, 16))

/**
 * Return bytes from number array
 * @param arr
 */
const fromArray = (arr: number[]): string =>
  arr.reduce((r, v) => r + v.toString(16).padStart(2, '0'), '0x')

/**
 * Return Uint8Array from bytes string
 *
 * @param hex
 */
const toUint8Array = (bytes: string): Uint8Array =>
  new Uint8Array(toArray(bytes))

/**
 * Return bytes string from Uint8Array
 *
 * @param arr
 */
const fromUint8Array = (arr: Uint8Array): string => fromArray(Array.from(arr))

/**
 * Return bytes string from number
 *
 * @param num
 */
const fromNumber = (num: number): string =>
  `0x${num.toString(16).padStart(2, '0')}`

/**
 * Return bytes string from number string
 *
 * @param num
 */
const fromNumberString = (str: string): string => {
  return `0x${new BN(str).toString(16).padStart(2, '0')}`
}

/**
 * return bytes number from bytes string
 *
 * @param bytes
 */
const toNumber = (bytes: string): number =>
  bytes.slice(2) === '' ? 0 : parseInt(bytes.slice(2), 16)

/**
 * concat two bytes string
 *
 * @param a
 * @param b
 */
const concat = (a: string, b: string): string => a.concat(b.slice(2))

const fromNat = (bn: string): string => {
  if (!bn) {
    return '0x'
  }
  return bn === '0x0' ? '0x' : bn.length % 2 === 0 ? bn : '0x0' + bn.slice(2)
}

const toNat = (bn: string): string => (bn[2] === '0' ? '0x' + bn.slice(3) : bn)

/**
 * From ASCII to bytes string
 *
 * @param ascii
 */
const fromAscii = (ascii: string): string =>
  ascii.split('').reduce(
    (r, v) =>
      r +
      v
        .charCodeAt(0)
        .toString(16)
        .padStart(2, '0'),
    '0x'
  )

/**
 * Return ASCII string from bytes string
 *
 * @param bytes
 */
const toAscii = (bytes: string): string =>
  bytes
    .slice(2)
    .match(/\w{2}/g)
    .map(bit => String.fromCharCode(parseInt(bit, 16)))
    .join('')

/**
 * Return bytes string from string
 *
 * @param s
 */
const fromString = (s: string): string => {
  return fromArray(
    unescape(encodeURIComponent(s))
      .split('')
      .map(bit => bit.charCodeAt(0))
  )
}

/**
 * Return string from bytes string
 *
 * @param s
 */
const toString = (bytes: string): string => {
  return decodeURIComponent(
    escape(
      toArray(bytes)
        .map(bit => String.fromCharCode(bit))
        .join('')
    )
  )
}

export default {
  at,
  concat,
  flatten,
  fromArray,
  fromAscii,
  fromNat,
  fromNumber,
  fromNumberString,
  fromString,
  fromUint8Array,
  length,
  pad,
  padRight,
  reverse,
  slice,
  toArray,
  toAscii,
  toNat,
  toNumber,
  toString,
  toUint8Array
}
