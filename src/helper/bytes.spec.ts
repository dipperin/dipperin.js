import bytes from './bytes'

test('lib/bytes/at', () => {
  expect(bytes.at('0x1234', 0)).toBe(18)
})

test('lib/bytes/flatten', () => {
  expect(bytes.flatten(['0x12', '0x32', '0x45'])).toBe('0x123245')
})

test('lib/bytes/slice', () => {
  expect(bytes.slice(0, 2, '0x123456')).toBe('0x1234')
})

test('lib/bytes/reverse', () => {
  expect(bytes.reverse('0x123456')).toBe('0x563412')
})

test('lib/bytes/pad', () => {
  expect(bytes.pad(6, '0x12')).toBe('0x000000000012')
})

test('lib/bytes/padRight', () => {
  expect(bytes.padRight(6, '0x12')).toBe('0x120000000000')
})

test('lib/bytes/toArray', () => {
  expect(bytes.toArray('0x121314')).toEqual([18, 19, 20])
})

test('lib/bytes/fromArray', () => {
  expect(bytes.fromArray([18, 19, 20])).toEqual('0x121314')
})

test('lib/bytes/toUint8Array', () => {
  expect(bytes.toUint8Array('0x121314')).toEqual(new Uint8Array([18, 19, 20]))
})

test('lib/bytes/fromUint8Array', () => {
  expect(bytes.fromUint8Array(new Uint8Array([18, 19, 20]))).toEqual('0x121314')
})

test('lib/bytes/fromNumber', () => {
  expect(bytes.fromNumber(18)).toEqual('0x12')
})

test('lib/bytes/toNumber', () => {
  expect(bytes.toNumber('0x12')).toBe(18)
})

test('lib/bytes/concat', () => {
  expect(bytes.concat('0x1234', '0x5678')).toBe('0x12345678')
})

test('lib/bytes/fromNat', () => {
  expect(bytes.fromNat('0x0')).toBe('0x')
  expect(bytes.fromNat('0x01')).toBe('0x01')
  expect(bytes.fromNat('0x123')).toBe('0x0123')
})

test('lib/bytes/toNat', () => {
  expect(bytes.toNat('0x0123')).toBe('0x123')
  expect(bytes.toNat('0x2123')).toBe('0x2123')
})

test('lib/bytes/fromAscii', () => {
  expect(bytes.fromAscii('ascii')).toBe('0x6173636969')
  expect(bytes.fromAscii('test')).toBe('0x74657374')
})

test('lib/bytes/toAscii', () => {
  expect(bytes.toAscii('0x6173636969')).toBe('ascii')
  expect(bytes.toAscii('0x74657374')).toBe('test')
})

test('lib/bytes/fromString', () => {
  expect(bytes.fromString('测试')).toBe('0xe6b58be8af95')
  expect(bytes.fromString('测试另类')).toBe('0xe6b58be8af95e58fa6e7b1bb')
})

test('lib/bytes/toString', () => {
  expect(bytes.toString('0xe6b58be8af95')).toBe('测试')
  expect(bytes.toString('0xe6b58be8af95e58fa6e7b1bb')).toBe('测试另类')
})
