import BN from 'bignumber.js'
import Bytes from './bytes'

const fromBN = (bn: BN): string => `0x${bn.toString(16)}`

const toBN = (str: string): BN => new BN(str.slice(2), 16)

const fromString = (str: string): string => {
  const bn =
    '0x' +
    (str.slice(0, 2) === '0x'
      ? new BN(str.slice(2), 16)
      : new BN(str, 10)
    ).toString(16)
  return bn === '0x0' ? '0x' : bn
}

const toString = (a: string): string => toBN(a).toString(10)

const fromNumber = (a: string | number): string =>
  typeof a === 'string'
    ? /^0x/.test(a)
      ? a
      : `0x${a}`
    : `0x${new BN(a).toString(16)}`

const toNumber = (a: string): number => toBN(a).toNumber()

const toUint256 = (a: string): string => Bytes.pad(32, a)

const bin = (method: string): ((a: string, b: string) => string) => (
  a: string,
  b: string
): string => fromBN(toBN(a)[method](toBN(b)))

const add = bin('add')
const mul = bin('mul')
const div = bin('div')
const sub = bin('sub')

export default {
  add,
  div,
  fromBN,
  fromNumber,
  fromString,
  mul,
  sub,
  toBN,
  toNumber,
  toString,
  toUint256
}
