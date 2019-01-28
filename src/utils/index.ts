import BN from 'bignumber.js'
import {
  isObject,
  isArray,
  isString,
  isFunction,
  isUndefined,
  isNumber
} from 'lodash'
import Helper from '../helper'
import {
  checkAddressChecksum,
  dechunk,
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

export const fireError = (error, emitter, reject, callback) => {
  let err = error
  if (isObject(err) && !(err instanceof Error) && err.data) {
    if (isObject(err.data) || isArray(err.data)) {
      err.data = JSON.stringify(err.data, null, 2)
    }

    err = `${error.message}\n'${error.data}`
  }

  if (isString(err)) {
    err = new Error(err)
  }

  if (isFunction(callback)) {
    callback(err)
  }
  if (isFunction(reject)) {
    // suppress uncatched error if an error listener is present
    // OR suppress uncatched error if an callback listener is present
    if (
      (emitter &&
        (isFunction(emitter.listeners) && emitter.listeners('error').length)) ||
      isFunction(callback)
    ) {
      emitter.catch(noop)
    }
    // reject later, to be able to return emitter
    setImmediate(() => {
      reject(error)
    })
  }

  if (emitter && isFunction(emitter.emit)) {
    // emit later, to be able to return emitter
    setImmediate(() => {
      emitter.emit('error', error)
      emitter.removeAllListeners()
    })
  }

  return emitter
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
  csk: '1000000000'
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
  const unit = getUnit(unitType) || unitMap.csk

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
  const unit = getUnit(unitType) || unitMap.csk

  return bn.times(unit).toString(10)
}

export default {
  checkAddressChecksum,
  dechunk,
  fireError,
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
  formatUtf8ToHex
}
