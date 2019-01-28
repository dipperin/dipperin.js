import BN from 'bignumber.js'
import nat from './nat'

test('lib/nat/fromBN', () => {
  expect(nat.fromBN(new BN('18'))).toBe('0x12')
})

test('lib/nat/toBN', () => {
  expect(nat.toBN('0x12').toString(16)).toEqual('12')
})

test('lib/nat/fromString', () => {
  expect(nat.fromString('18')).toBe('0x12')
  expect(nat.fromString('255')).toBe('0xff')
})

test('lib/nat/fromNumber', () => {
  expect(nat.fromNumber(18)).toBe('0x12')
  expect(nat.fromNumber('18')).toBe('0x18')
})

test('lib/nat/toNumber', () => {
  expect(nat.toNumber('0x12')).toBe(18)
})

test('lib/nat/toUint256', () => {
  expect(nat.toUint256('0x12')).toBe(
    '0x0000000000000000000000000000000000000000000000000000000000000012'
  )
})

test('lib/nat/toString', () => {
  expect(nat.toString('0x12')).toBe('18')
})
