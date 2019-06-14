import Utils from './index'

test('Utils/toChecksumAddress', () => {
  expect(Utils.toChecksumAddress(undefined)).toBe('')
  expect(() => {
    Utils.toChecksumAddress('')
  }).toThrow()
  expect(
    Utils.toChecksumAddress('0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b')
  ).toBe('0x0x56e81F171BcC55A6ff8345E692C0f86E5B48e01b')
})

test('Utils/getUnit', () => {
  expect(Utils.getUnit('null')).toEqual('0')
  expect(Utils.getUnit('units')).toEqual('1')
  expect(Utils.getUnit('thousands')).toEqual('1000')
  expect(Utils.getUnit('millions')).toEqual('1000000')
  expect(Utils.getUnit('dip')).toEqual('1000000000')
  expect(Utils.getUnit('')).toEqual(undefined)
})

test('Utils/fromUnit', () => {
  expect(Utils.fromUnit('1000000000')).toEqual('1')
  expect(Utils.fromUnit('1000000000', 'dip')).toEqual('1')
  expect(Utils.fromUnit('100000000', 'millions')).toEqual('100')
  expect(Utils.fromUnit('100000000', 'thousands')).toEqual('100000')
  expect(Utils.fromUnit('100000000', 'units')).toEqual('100000000')
})

test('Utils/toUnit', () => {
  expect(Utils.toUnit('1')).toEqual('1000000000')
  expect(Utils.toUnit('1', 'dip')).toEqual('1000000000')
  expect(Utils.toUnit('1', 'millions')).toEqual('1000000')
  expect(Utils.toUnit('1', 'thousands')).toEqual('1000')
  expect(Utils.toUnit('1', 'units')).toEqual('1')
})

test('Utils/toUnit', () => {
  expect(Utils.typeStringToBytes('123', 'int32')).toEqual('0x0000007b')
  expect(Utils.typeStringToBytes('123', 'int64')).toEqual('0x000000000000007b')
  expect(Utils.typeStringToBytes('dipp', 'string')).toEqual('0x64697070')
  // expect(Utils.typeStringToBytes('12345.3', 'float32')).toEqual('0x33e54046')
})
