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
