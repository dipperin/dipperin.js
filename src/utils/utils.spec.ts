import BN from 'bignumber.js'
import {
  checkAddressChecksum,
  hexToUtf8,
  hexToBase64,
  hexToBytes,
  hexToNumber,
  hexToBuffer,
  isAddress,
  isContractAddress,
  isBN,
  isHexStrict,
  sha3,
  toBN,
  utf8ToHex,
  numberToHex,
  decodeBase64
} from './utils'

test('utils/utils/hexToUtf8', () => {
  expect(
    hexToUtf8(
      '0x7b22616374696f6e223a22637265617465222c22636f6e74726163745f61646472657373223a2230783030313062384639323641663146353938306335303545663639306564326636614361666633413538433261222c22706172616d73223a227b5c226f776e65725c223a5c22307830303030314230653132643362333946363036663242383364356337386432433341343141394343393143465c222c5c22746f6b656e5f6e616d655c223a5c22546573745c222c5c22746f6b656e5f646563696d616c735c223a31322c5c22746f6b656e5f73796d626f6c5c223a5c227465775c222c5c22746f6b656e5f746f74616c5f737570706c795c223a5c22307833666137343038663961336535643332323835343030305c222c5c2262616c616e6365735c223a7b5c22307830303030314230653132643362333946363036663242383364356337386432433341343141394343393143465c223a5c22307833666137343038663961336535643332323835343030305c227d2c5c22616c6c6f7765645c223a7b7d7d227d'
    )
  ).toEqual(
    '{"action":"create","contract_address":"0x0010b8F926Af1F5980c505Ef690ed2f6aCaff3A58C2a","params":"{\\"owner\\":\\"0x00001B0e12d3b39F606f2B83d5c78d2C3A41A9CC91CF\\",\\"token_name\\":\\"Test\\",\\"token_decimals\\":12,\\"token_symbol\\":\\"tew\\",\\"token_total_supply\\":\\"0x3fa7408f9a3e5d322854000\\",\\"balances\\":{\\"0x00001B0e12d3b39F606f2B83d5c78d2C3A41A9CC91CF\\":\\"0x3fa7408f9a3e5d322854000\\"},\\"allowed\\":{}}"}'
  )
})

test('utils/utils/isBN', () => {
  expect(isBN(new BN('123'))).toBeTruthy()
  expect(isBN({})).toBeFalsy()
})

test('utils/utils/numberToHex', () => {
  expect(numberToHex('0')).toEqual('0x0')
})

test('utils/utils/hexToNumber', () => {
  expect(hexToNumber('0x1234')).toBe(4660)
  expect(hexToNumber('0x34')).toBe(52)
  expect(hexToNumber('0x')).toBe(0)
})

test('utils/utils/toBN', () => {
  expect(() => {
    const bn = toBN('124214')
    return bn
  }).not.toThrow()
})

test('utils/utils/sha3', () => {
  expect(sha3('test123')).toBe(
    '0xf81b517a242b218999ec8eec0ea6e2ddbef2a367a14e93f4a32a39e260f686ad'
  )
  expect(sha3('test(int)')).toBe(
    '0xf4d03772bec1e62fbe8c5691e1a9101e520e8f8b5ca612123694632bf3cb51b1'
  )
  expect(sha3(0x80)).toBe(
    '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'
  )
  expect(sha3('0x80')).toBe(
    '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'
  )
  expect(
    sha3('0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1')
  ).toBe('0x82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28')
})

test('utils/utils/isHexStrict', () => {
  expect(isHexStrict('0xc1912')).toBeTruthy()
  expect(isHexStrict('123')).toBeFalsy()
  expect(isHexStrict('c1912')).toBeFalsy()
  expect(isHexStrict('345')).toBeFalsy()
  expect(isHexStrict('0xc12')).toBeTruthy()
})

test('utils/utils/hexToBytes', () => {
  expect(hexToBytes('0x123')).toEqual([18, 3])
  expect(hexToBytes('0xffff')).toEqual([255, 255])
  expect(() => {
    hexToBytes('123')
  }).toThrow()
})

test('utils/utils/isAddress', () => {
  expect(
    isAddress('0x0000c1912fee45d61c87cc5ea59dae31190fffff232d')
  ).toBeTruthy()
  expect(isAddress('0000c1912fee45d61c87cc5ea59dae31190fffff232d')).toBeTruthy()
  expect(
    isAddress('0X0000C1912FEE45D61C87CC5EA59DAE31190FFFFF232D')
  ).toBeTruthy()
  expect(
    isAddress('0x0000c1912fEe45d61C87CC5ea59DAe31190FFfFf232D')
  ).toBeTruthy()
  expect(isAddress('0x0000C1912fEE45d61C87Cc5EA59DaE31190FFFFf232d')).toBe(
    false
  )
})

test('utils/utils/checkAddressChecksum', () => {
  expect(
    checkAddressChecksum('0x0000c1912fEe45d61C87CC5ea59DAe31190FFfFf232D')
  ).toBeTruthy()
  expect(
    checkAddressChecksum('0x0000c1912fEE45d61C87Cc5EA59DaE31190FFFFf232b')
  ).toBeFalsy()
})

test('utils/utils/utf8ToHex', () => {
  const tests = [
    {
      expected:
        '0x486565c3a4c3b6c3b6c3a4f09f9185443334c99dc9a33234d084cdbd2d2e2cc3a4c3bc2b232f',
      value: 'Heeäööä👅D34ɝɣ24Єͽ-.,äü+#/'
    },
    { value: 'myString', expected: '0x6d79537472696e67' },
    { value: 'myString\x00', expected: '0x6d79537472696e67' },
    {
      expected: '0x65787065637465642076616c7565',
      value: 'expected value\u0000\u0000\u0000'
    },
    {
      expected: '0x657870656374000065642076616c7565',
      value: 'expect\u0000\u0000ed value\u0000\u0000\u0000'
    },
    {
      expected:
        '0xe68891e883bde5909ee4b88be78ebbe79283e8808ce4b88de4bca4e8baabe4bd93e38082',
      value: '我能吞下玻璃而不伤身体。'
    },
    {
      expected:
        '0xeb8298eb8a9420ec9ca0eba6aceba5bc20eba8b9ec9d8420ec889820ec9e88ec96b4ec9a942e20eab7b8eb9e98eb8f8420ec9584ed9484eca78020ec958aec9584ec9a94',
      value: '나는 유리를 먹을 수 있어요. 그래도 아프지 않아요'
    }
  ]
  tests.forEach(item => {
    expect(utf8ToHex(item.value)).toBe(item.expected)
  })
})

test('utils/utils/hexToBase64', () => {
  expect(
    hexToBase64(
      '037db227d7094ce215c3a0f57e1bcc732551fe351f94249471934567e0f5dc1bf7'
    )
  ).toBe('A32yJ9cJTOIVw6D1fhvMcyVR/jUflCSUcZNFZ+D13Bv3')
  expect(
    hexToBase64(
      '0390a8c392f473e0c2dcb4c484f155db64eb7256034c6c108159ec99c9ba144cf7'
    )
  ).toBe('A5Cow5L0c+DC3LTEhPFV22TrclYDTGwQgVnsmcm6FEz3')
})

test('utils/utils/hexToBuffer', () => {
  expect(hexToBuffer('1234')).toEqual(Buffer.from('1234', 'hex'))
  expect(Buffer.from('1234', 'hex')).toEqual(Buffer.from('1234', 'hex'))
})

test('utils/utils/isContractAddress', () => {
  expect(
    isContractAddress('0x0010c1912fee45d61c87cc5ea59dae31190fffff232d')
  ).toEqual(true)
})

test('utils/utils/decodeBase64', () => {
  expect(decodeBase64('5rWL6K+V')).toEqual('测试')
})
