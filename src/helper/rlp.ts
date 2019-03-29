import { isString, isArray } from 'lodash'
import Utils from '../utils'

// The RLP format
// Serialization and deserialization for the BytesTree type, under the following grammar:
// | First byte | Meaning                                                                    |
// | ---------- | -------------------------------------------------------------------------- |
// | 0   to 127 | HEX(leaf)                                                                  |
// | 128 to 183 | HEX(length_of_leaf + 128) + HEX(leaf)                                      |
// | 184 to 191 | HEX(length_of_length_of_leaf + 128 + 55) + HEX(length_of_leaf) + HEX(leaf) |
// | 192 to 247 | HEX(length_of_node + 192) + HEX(node)                                      |
// | 248 to 255 | HEX(length_of_length_of_node + 128 + 55) + HEX(length_of_node) + HEX(node) |
export const padEven = (str: string): string => {
  return str.length % 2 === 0 ? str : `0${str}`
}

export const uint = (num: number): string => padEven(num.toString(16))

export const length = (len: number, add: number): string => {
  return len < 56
    ? uint(add + len)
    : uint(add + uint(len).length / 2 + 55) + uint(len)
}

export const dataTree = (tree: string | any[]): string => {
  if (isString(tree)) {
    const hex = tree.slice(2)
    const pre =
      hex.length !== 2 || hex >= '80' ? length(hex.length / 2, 128) : ''
    return pre + hex
  } else {
    const hex = tree.map(dataTree).join('')
    const pre = length(hex.length / 2, 192)
    return pre + hex
  }
}

const encode = (tree: string | any[]): string => {
  return `0x${dataTree(
    isArray(tree)
      ? tree
      : Utils.isHexStrict(tree)
        ? tree
        : Utils.utf8ToHex(tree)
  )}`
}

export interface DecodeResultInterface {
  len: number
  tree: string | any[]
}

const parseLength = (hex: string): number => {
  const len = parseInt(hex.slice(0, 2), 16) % 64
  return len < 56 ? len : parseInt(hex.slice(2, 2 + (len - 55) * 2), 16)
}

const parseListLength = (
  hex: string
): {
  len: number
  lengthHexLen: number
} => {
  const len = parseInt(hex.slice(0, 2), 16) % 64
  return {
    len: len < 56 ? len : parseInt(hex.slice(2, 2 + (len - 55) * 2), 16),
    lengthHexLen: (len - 55) * 2 > 0 ? (len - 55) * 2 : 0
  }
}

const parseHex = (hex: string): DecodeResultInterface => {
  const len = parseLength(hex)
  if ((hex.length - 2) / 2 < len) {
    throw ''
  }
  return { len, tree: `0x${hex.slice(2, len * 2 + 2)}` }
}

const parseList = (hex: string): DecodeResultInterface => {
  const resultTree = []
  const { len, lengthHexLen } = parseListLength(hex)
  let nowLen = 0
  const nowHex = hex.slice(lengthHexLen + 2)
  while (nowLen < len) {
    const thatHex = nowHex.slice(nowLen * 2)

    const { len: thisLen, tree } = parseTree(thatHex)

    nowLen += thisLen + 1
    resultTree.push(tree)
  }
  return { len: len + lengthHexLen / 2, tree: resultTree }
}

const parseTree = (hex: string): DecodeResultInterface => {
  if (hex.length === 0) {
    throw ''
  }
  const head = hex.slice(0, 2)
  if (head < '80') {
    return { len: 0, tree: `0x${head}` }
  } else if (head < 'c0') {
    return parseHex(hex)
  } else {
    return parseList(hex)
  }
}

const decode = (hex: string) => {
  try {
    const { tree } = parseTree(hex.slice(2))
    return tree
  } catch (_) {
    return []
  }
}

export default {
  decode,
  encode
}

// 0xf901f6f901ad0196

// 0xf9 list long 2
// 01f6f901ad01
// 96
// 0010b8f926af1f5980c505ef690ed2f6acaff3a58c2a
// 80
// 80
// 80
// 82bfcc
// b9018c7b22616374696f6e223a22637265617465222c22636f6e74726163745f61646472657373223a2230783030313062384639323641663146353938306335303545663639306564326636614361666633413538433261222c22706172616d73223a227b5c226f776e65725c223a5c22307830303030314230653132643362333946363036663242383364356337386432433341343141394343393143465c222c5c22746f6b656e5f6e616d655c223a5c22546573745c222c5c22746f6b656e5f646563696d616c735c223a31322c5c22746f6b656e5f73796d626f6c5c223a5c227465775c222c5c22746f6b656e5f746f74616c5f737570706c795c223a5c22307833666137343038663961336535643332323835343030305c222c5c2262616c616e6365735c223a7b5c22307830303030314230653132643362333946363036663242383364356337386432433341343141394343393143465c223a5c22307833666137343038663961336535643332323835343030305c227d2c5c22616c6c6f7765645c223a7b7d7d
// 22
// 7d
// f844a0
// 481f4e40e0525e3b07a63f20a43cf7767eebbb399fb97ba4725d3325e68a02ad
// a0
// 6c9daa333856b90d86952216acd34be950f6cbcae9b4402453538283db720bfc
// 38
// 80

// [
//   ([
//     '0x01',
//     '0x0010b8f926af1f5980c505ef690ed2f6acaff3a58c2a',
//     '0x',
//     '0x',
//     '0x',
//     '0xbfcc',
//     '0x018c7b22616374696f6e223a22637265617465222c22636f6e74726163745f61646472657373223a2230783030313062384639323641663146353938306335303545663639306564326636614361666633413538433261222c22706172616d73223a227b5c226f776e65725c223a5c22307830303030314230653132643362333946363036663242383364356337386432433341343141394343393143465c222c5c22746f6b656e5f6e616d655c223a5c22546573745c222c5c22746f6b656e5f646563696d616c735c223a31322c5c22746f6b656e5f73796d626f6c5c223a5c227465775c222c5c22746f6b656e5f746f74616c5f737570706c795c223a5c22307833666137343038663961336535643332323835343030305c222c5c2262616c616e6365735c223a7b5c22307830303030314230653132643362333946363036663242383364356337386432433341343141394343393143465c223a5c22307833666137343038663961336535643332323835343030305c227d2c5c22616c6c6f7765645c223a7b7d7d',
//     '0x22',
//     '0x7d'
//   ],
//   [
//     '0x481f4e40e0525e3b07a63f20a43cf7767eebbb399fb97ba4725d3325e68a02ad',
//     '0x6c9daa333856b90d86952216acd34be950f6cbcae9b4402453538283db720bfc',
//     '0x38',
//     '0x'
//   ])
// ]
// {
//   transactionResult:
//    { txData:
//       { nonce: '1',
//         to: '0x0010b8f926af1f5980c505ef690ed2f6acaff3a58c2a',
//         hashLock: '0x',
//         timeLock: 0,
//         value: '0',
//         fee: '49100',
//         extraData:
//          '0x018c7b22616374696f6e223a22637265617465222c22636f6e74726163745f61646472657373223a2230783030313062384639323641663146353938306335303545663639306564326636614361666633413538433261222c22706172616d73223a227b5c226f776e65725c223a5c22307830303030314230653132643362333946363036663242383364356337386432433341343141394343393143465c222c5c22746f6b656e5f6e616d655c223a5c22546573745c222c5c22746f6b656e5f646563696d616c735c223a31322c5c22746f6b656e5f73796d626f6c5c223a5c227465775c222c5c22746f6b656e5f746f74616c5f737570706c795c223a5c22307833666137343038663961336535643332323835343030305c222c5c2262616c616e6365735c223a7b5c22307830303030314230653132643362333946363036663242383364356337386432433341343141394343393143465c223a5c22307833666137343038663961336535643332323835343030305c227d2c5c22616c6c6f7765645c223a7b7d7d' },
//      witness:
//       { r:
//          '0x481f4e40e0525e3b07a63f20a43cf7767eebbb399fb97ba4725d3325e68a02ad',
//         s:
//          '0x6c9daa333856b90d86952216acd34be950f6cbcae9b4402453538283db720bfc',
//         v: '0x38',
//         hashKey: '0x' } } }
