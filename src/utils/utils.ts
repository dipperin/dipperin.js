import BN from 'bignumber.js'
import { Base64 } from 'js-base64'
import { isString, isNumber, isNil } from 'lodash'
import utf8 from 'utf8'
import Helper from '../helper'
import Bytes from '../helper/bytes'

/**
 * Returns true if object is BN, otherwise false
 *
 * @method isBN
 * @param {Object} object
 * @return {Boolean}
 */
export const isBN: (value: any) => boolean = BN.isBigNumber
/**
 * Do nothing
 * @param ___
 */
export const noop = (...__) => null

/**
 * Converts hex string to number
 * @param {String} value
 */
export const hexToNumber = (value: string): number => {
  if (!value) {
    // return value
    return 0
  }
  if (value === '0x') {
    return 0
  }
  return toBN(value).toNumber()
}

/**
 * Takes an input and transforms it into an BN
 *
 * @method toBN
 * @param {Number|String|BN} num, string, HEX string or BN
 * @return {BN} BN
 */
export const toBN = (num: number | string | BN): BN => {
  try {
    return new BN(num)
  } catch (e) {
    throw new Helper.Errors.ToBigNumberError(e, num)
  }
}

const SHA3_NULL_S =
  '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'

/**
 * Hashes values to a sha3 hash using keccak 256
 *
 * To hash a HEX string the hex must have 0x in front.
 *
 * @method sha3
 * @return {String} the sha3 string
 */
export const sha3 = (value: string | number | Buffer): string => {
  const val =
    isHexStrict(value) && /^0x/i.test(value.toString())
      ? hexToBytes(value)
      : value
  const returnValue = Helper.Hash.keccak256(val) // jshint ignore:line

  if (returnValue === SHA3_NULL_S) {
    return null
  } else {
    return returnValue
  }
}

/**
 * Check if string is HEX, requires a 0x in front
 *
 * @method isHexStrict
 * @param {String} hex to be checked
 * @returns {Boolean}
 */
export const isHexStrict = (hex: string | number | Buffer): boolean => {
  return (
    (isString(hex) || isNumber(hex)) && /^(-)?0x[0-9a-f]*$/i.test(String(hex))
  )
}

/**
 * Convert a hex string to a byte array
 *
 * Note: Implementation from crypto-js
 *
 * @method hexToBytes
 * @param {any} hex
 * @return {Array} the byte array
 */
export const hexToBytes = (hex: any): any[] => {
  let hexStr = hex.toString(16)
  if (!isHexStrict(hexStr)) {
    throw new Helper.Errors.InvalidHexStringError(hexStr)
  }

  hexStr = hex.replace(/^0x/i, '')
  const bytes = []
  for (let c = 0; c < hexStr.length; c += 2) {
    bytes.push(parseInt(hexStr.substr(c, 2), 16))
  }
  return bytes
}

/**
 * Checks if the given string is an address
 *
 * @method isAddress
 * @param {String} address the given HEX address
 * @return {Boolean}
 */
export const isAddress = (address: string): boolean => {
  // check if it has the basic requirements of an address
  if (!/^(0x)?[0-9a-f]{44}$/i.test(address)) {
    return false
    // If it's ALL lowercase or ALL upppercase
  } else if (
    /^(0x|0X)?[0-9a-f]{44}$/.test(address) ||
    /^(0x|0X)?[0-9A-F]{44}$/.test(address)
  ) {
    return true
    // Otherwise check each case
  } else {
    return checkAddressChecksum(address)
  }
}

const CONTRACT_ADDRESS_PREFIX_ERC20 = '0010'

/**
 * Checks if the given string is an contract address
 * @param address the given HEX address
 */
export const isContractAddress = (address: string): boolean => {
  if (!isAddress(address)) {
    return false
  }

  const prefix = address.replace('0x', '').slice(0, 4)

  switch (prefix) {
    case CONTRACT_ADDRESS_PREFIX_ERC20:
      return true
    default:
      return false
  }
}

/**
 * Checks if the given string is a checksummed address
 *
 * @method checkAddressChecksum
 * @param {String} address the given HEX address
 * @return {Boolean}
 */
export const checkAddressChecksum = (addrs: string): boolean => {
  const address = addrs.replace(/^0x/i, '')
  const addressHash = sha3(address.toLowerCase()).replace(/^0x/i, '')

  for (let i = 0; i < 44; i++) {
    // the nth letter should be uppercase if the nth digit of casemap is 1
    if (
      (parseInt(addressHash[i], 16) > 7 &&
        address[i].toUpperCase() !== address[i]) ||
      (parseInt(addressHash[i], 16) <= 7 &&
        address[i].toLowerCase() !== address[i])
    ) {
      return false
    }
  }
  return true
}

/**
 * Check if string is HEX
 *
 * @method isHex
 * @param {String} hex to be checked
 * @returns {Boolean}
 */
export const isHex = (hex: string | number): boolean => {
  return (
    (isString(hex) || isNumber(hex)) &&
    /^(-0x|0x)?[0-9a-f]*$/i.test(String(hex))
  )
}

/**
 * Converts value to it's hex representation
 *
 * @method numberToHex
 * @param {String|Number|BN} value
 * @return {String}
 */
export const numberToHex = (value: string | number | BN): string => {
  if (isNil(value)) {
    return value
  }

  const num = toBN(value)

  if (
    !num.isFinite() &&
    (isNumber(value) || isString(value)) &&
    !isHexStrict(value)
  ) {
    throw new Helper.Errors.InvalidNumberError(value)
  }

  const result = num.toString(16)

  return num.lt(new BN(0)) ? '-0x' + result.substr(1) : '0x' + result
}

/**
 * Should be called to get hex representation (prefixed by 0x) of utf8 string
 *
 * @method utf8ToHex
 * @param {String} str
 * @returns {String} hex representation of input string
 */
export const utf8ToHex = (str: string): string => {
  let utfStr = utf8.encode(str)
  let hex = ''

  // remove \u0000 padding from either side
  utfStr = utfStr.replace(/^(?:\u0000)*/, '')
  utfStr = utfStr
    .split('')
    .reverse()
    .join('')
  utfStr = utfStr.replace(/^(?:\u0000)*/, '')
  utfStr = utfStr
    .split('')
    .reverse()
    .join('')

  for (let i = 0; i < utfStr.length; i++) {
    const code = utfStr.charCodeAt(i)
    const n = code.toString(16)

    hex += n.length < 2 ? `0${n}` : n
  }

  return `0x${hex}`
}

/**
 * Should be called to get utf8 from it's hex representation
 *
 * @param hexStr
 */
export const hexToUtf8 = (hexStr: string) => {
  if (!isHexStrict(hexStr)) {
    throw new Helper.Errors.InvalidHexStringError(hexStr)
  }
  let hex = hexStr

  let str = ''
  let code = 0
  hex = hex.replace(/^0x/i, '')
  // remove 00 padding from either side
  hex = hex.replace(/^(?:00)*/, '')
  hex = hex
    .split('')
    .reverse()
    .join('')
  hex = hex.replace(/^(?:00)*/, '')
  hex = hex
    .split('')
    .reverse()
    .join('')
  const l = hex.length

  for (let i = 0; i < l; i += 2) {
    code = parseInt(hex.substr(i, 2), 16)
    str += String.fromCharCode(code)
  }

  try {
    return utf8.decode(str)
  } catch (err) {
    return hexStr
  }
}

/**
 * Should be called to get base64 from it's hex representation
 *
 * @param hex
 */
export const hexToBase64 = (hex: string): string => {
  return Base64.btoa(
    hex
      .match(/\w{2}/g)
      .map(item => String.fromCharCode(parseInt(item, 16)))
      .join('')
  )
}

/**
 * Should be called to get string from base64
 * @param base base64 string
 */
export const decodeBase64 = (base: string): string => {
  return Base64.decode(base)
}

/**
 * Converts value to it's decimal representation in string
 *
 * @param hex
 */
export const hexToNumberString = (hex: string) => {
  return hex ? (hex === '0x' ? '0' : toBN(hex).toString(10)) : hex
}

/**
 * Converts hex to Buffer
 *
 * @param hex
 */
export const hexToBuffer = (hex: string | Buffer): Buffer => {
  return isString(hex) ? Buffer.from(hex, 'hex') : hex
}

export const dechunk = (data: string): string => {
  return data
    .replace(/\}[\n\r]?\{/g, '}|--|{') // }{
    .replace(/\}\][\n\r]?\[\{/g, '}]|--|[{') // }][{
    .replace(/\}[\n\r]?\[\{/g, '}|--|[{') // }[{
    .replace(/\}\][\n\r]?\{/g, '}]|--|{') // }]{
}

/**
 * encode format utils
 */

export const formatNumberToHex = (value: number | string) => {
  return isHexStrict(value)
    ? Bytes.fromNat(value as string)
    : Bytes.fromNat(numberToHex(value))
}

/**
 * Converts string of utf-8 to hex
 * @method formatUtf8ToHex
 * @param {String} value
 * @return {String}
 */
export const formatUtf8ToHex = (value: string) => {
  return isHexStrict(value) ? Bytes.fromNat(value as string) : utf8ToHex(value)
}
