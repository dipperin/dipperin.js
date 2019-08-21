import BN from 'bignumber.js'
import { isString, isFunction, isUndefined, isNumber } from 'lodash'
// import { Parser } from 'binary-parser'
import Helper from '../helper'
import {
  checkAddressChecksum,
  dechunk,
  decodeBase64,
  hexToBase64,
  hexToBytes,
  hexToNumber,
  hexToNumberString,
  hexToUtf8,
  hexToBuffer,
  isAddress,
  isContractAddress,
  isBN,
  isHex,
  isHexStrict,
  noop,
  numberToHex,
  sha3,
  toBN,
  utf8ToHex,
  formatNumberToHex,
  formatUtf8ToHex
} from './utils'
import { Callback } from '../providers'
import bytes from '../helper/bytes'

export const typeStringToBytes = (str: string, type: string) => {
  switch (type) {
    case 'int32':
    case 'uint32':
    case 'uint':
    case 'int':
      return bytes.pad(4, bytes.fromNumberString(str))
    case 'int64':
    case 'uint64':
      return bytes.pad(8, bytes.fromNumberString(str))
    default:
      return bytes.fromString(str)
  }
}

export const fireError = (
  error: Error,
  reject: PromiseRejectionEvent,
  callback: Callback
) => {
  let err = error

  if (isString(err)) {
    err = new Error(err)
  }

  if (isFunction(callback)) {
    callback(err)
  }

  if (isFunction(reject)) {
    reject(error)
  }
}

export const toChecksumAddress = (address: string) => {
  let addrs = address
  if (isUndefined(address)) {
    return ''
  }

  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    throw new Helper.Errors.InvalidAddressError(address)
  }

  addrs = addrs.toLowerCase().replace(/^0x/i, '')
  const addressHash = sha3(address).replace(/^0x/i, '')
  let checksumAddress = '0x'

  for (let i = 0; i < address.length; i++) {
    // If ith character is 9 to f then make it uppercase
    if (parseInt(addressHash[i], 16) > 7) {
      checksumAddress += address[i].toUpperCase()
    } else {
      checksumAddress += address[i]
    }
  }
  return checksumAddress
}

export const unitMap = {
  null: '0',
  units: '1',
  thousands: '1000',
  millions: '1000000',
  billions: '1000000000',
  // dip: '1000000000'
  dip: '1000000000000000000'
}

export const getUnit = (unitType: string): string => {
  return unitMap[unitType]
}

export const fromUnit = (
  num: string | number | BN,
  unitType?: string
): string => {
  if (!isBN(num) && !isString(num) && isNumber(num)) {
    throw new Helper.Errors.InvalidNumberError(num)
  }

  const bn = toBN(num)
  const unit = getUnit(unitType) || unitMap.dip

  return bn.div(unit).toString(10)
}

export const toUnit = (
  num: string | number | BN,
  unitType?: string
): string => {
  if (!isBN(num) && !isString(num) && isNumber(num)) {
    throw new Helper.Errors.InvalidNumberError(num)
  }

  const bn = toBN(num)
  const unit = getUnit(unitType) || unitMap.dip

  return bn.times(unit).toString(10)
}

export default {
  checkAddressChecksum,
  dechunk,
  fireError,
  decodeBase64,
  hexToBase64,
  hexToBytes,
  hexToBuffer,
  hexToNumber,
  hexToNumberString,
  hexToUtf8,
  isAddress,
  isContractAddress,
  isBN,
  isHex,
  isHexStrict,
  noop,
  numberToHex,
  sha3,
  toBN,
  toChecksumAddress,
  utf8ToHex,
  unitMap,
  fromUnit,
  toUnit,
  getUnit,
  formatNumberToHex,
  formatUtf8ToHex,
  typeStringToBytes
}
