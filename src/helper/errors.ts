import { isPlainObject, isString } from 'lodash'
export class ConnectionTimeoutError extends Error {
  public name = 'ConnectionTimeoutError'

  constructor(ms: string) {
    super()
    Object.setPrototypeOf(this, ConnectionTimeoutError.prototype)
    this.message = `CONNECTION TIMEOUT: timeout of ${ms} ms achived`
  }
}

export class InvalidConnectionError extends Error {
  public name = 'InvalidConnectionError'

  constructor(host: string) {
    super()
    Object.setPrototypeOf(this, InvalidConnectionError.prototype)
    this.message = `CONNECTION ERROR: Couldn\'t connect to node ${host}.`
  }
}

export class InvalidNumberOfParamsError extends Error {
  public name = 'InvalidNumberOfParamsError'

  constructor(
    method: string | number,
    got: string | number,
    expected: string | number
  ) {
    super()
    Object.setPrototypeOf(this, InvalidNumberOfParamsError.prototype)
    this.message = `Invalid number of parameters for ${method}. Got ${got} expected ${expected} !`
  }
}

export class InvalidProviderError extends Error {
  public name = 'InvalidProviderError'

  constructor() {
    super()
    Object.setPrototypeOf(this, InvalidProviderError.prototype)
    this.message = 'Provider not set or invalid'
  }
}

export class ResponseError extends Error {
  public name = 'ResponseError'

  constructor(result) {
    super()
    Object.setPrototypeOf(this, ResponseError.prototype)
    const message =
      isPlainObject(result) &&
      isPlainObject(result.error) &&
      isString(result.error.message)
        ? result.error.message
        : JSON.stringify(result)
    this.message = `Returned error: "${message}"`
  }
}

export class InvalidResponseError extends Error {
  public name = 'InvalidResponseError'

  constructor(result) {
    super()
    Object.setPrototypeOf(this, InvalidResponseError.prototype)
    const message =
      isPlainObject(result) &&
      isPlainObject(result.error) &&
      isString(result.error.message)
        ? result.error.message
        : `Invalid JSON RPC response: ${JSON.stringify(result)}`
    this.message = `${message}`
  }
}

export class UnsupportedKdfError extends Error {
  public name = 'UnsupportedKdfError'

  constructor() {
    super()
    Object.setPrototypeOf(this, UnsupportedKdfError.prototype)
    this.message = 'Unsupported kdf'
  }
}

export class UnsupportedCipherError extends Error {
  public name = 'UnsupportedCipherError'

  constructor() {
    super()
    Object.setPrototypeOf(this, UnsupportedCipherError.prototype)
    this.message = 'Unsupported cipher'
  }
}

export class InvalidPasswordError extends Error {
  public name = 'InvalidPasswordError'

  constructor() {
    super()
    Object.setPrototypeOf(this, InvalidPasswordError.prototype)
    this.message = 'Invalid password'
  }
}

export class UnsupportedParamsToPBKDF2Error extends Error {
  public name = 'UnsupportedParamsToPBKDF2Error'

  constructor() {
    super()
    Object.setPrototypeOf(this, UnsupportedParamsToPBKDF2Error.prototype)
    this.message = 'Unsupported parameters to PBKDF2'
  }
}

export class KeyDerivationError extends Error {
  public name = 'KeyDerivationError'

  constructor() {
    super()
    Object.setPrototypeOf(this, KeyDerivationError.prototype)
    this.message = 'Key derivation error, possibly wrong password'
  }
}

export class InvalidMethodParamsError extends Error {
  public name = 'InvalidMethodParamsError'

  constructor() {
    super()
    Object.setPrototypeOf(this, InvalidMethodParamsError.prototype)
    this.message =
      'When creating a method you need to provide at least the "name" and "call" property.'
  }
}

export class InvalidProviderPathError extends Error {
  public name = 'InvalidProviderPathError'

  constructor(path: string) {
    super()
    Object.setPrototypeOf(this, InvalidProviderPathError.prototype)
    this.message = `Can't autodetect provider for "${path}"`
  }
}

export class WrongResponseIdError extends Error {
  public name = 'WrongResponseIdError'

  constructor(get, expected, payload) {
    super()
    Object.setPrototypeOf(this, WrongResponseIdError.prototype)
    this.message = `Wrong response id ${get} (expected: ${expected}) in ${JSON.stringify(
      payload
    )}`
  }
}

export class WrongMethodForParams extends Error {
  public name = 'WrongMethodForParams'

  constructor(params) {
    super()
    Object.setPrototypeOf(this, WrongMethodForParams.prototype)
    this.message = `JSONRPC method should be specified for params: "${JSON.stringify(
      params
    )}"!`
  }
}

export class DecryptAccountsError extends Error {
  public name = 'DecryptAccountsError'

  constructor() {
    super()
    Object.setPrototypeOf(this, DecryptAccountsError.prototype)
    this.message = "Couldn't decrypt accounts. Password wrong?"
  }
}

export class InvalidAddressError extends Error {
  public name = 'InvalidAddressError'

  constructor(address: string) {
    super()
    Object.setPrototypeOf(this, InvalidAddressError.prototype)
    this.message = `Provided address "${address}" is invalid, the capitalization checksum test failed.`
  }
}

export class InvalidPrivateKeyError extends Error {
  public name = 'InvalidPrivateKeyError'

  constructor(privateKey: string) {
    super()
    Object.setPrototypeOf(this, InvalidPrivateKeyError.prototype)
    this.message = `Provided private key "${privateKey}" is invalid.`
  }
}

export class InvalidPrivateKeyNumError extends Error {
  public name = 'InvalidPrivateKeyNumError'

  constructor(privateKeyNum: number) {
    super()
    Object.setPrototypeOf(this, InvalidPrivateKeyNumError.prototype)
    this.message = `Provided private key num "${privateKeyNum}" is not enough.`
  }
}

export class NoInvalidPrivateExtendedKeyError extends Error {
  public name = 'NoInvalidPrivateExtendedKeyError'

  constructor() {
    super()
    Object.setPrototypeOf(this, NoInvalidPrivateExtendedKeyError.prototype)
    this.message = 'This is no valid private extended key.'
  }
}

export class NoInvalidPrivateKeyError extends Error {
  public name = 'NoInvalidPrivateKeyError'

  constructor() {
    super()
    Object.setPrototypeOf(this, NoInvalidPrivateKeyError.prototype)
    this.message = 'This is no valid private key.'
  }
}

export class ToBigNumberError extends Error {
  public name = 'ToBigNumberError'

  constructor(e: Error, num) {
    super()
    Object.setPrototypeOf(this, ToBigNumberError.prototype)
    this.message = `${e} Given value: "${num}"`
  }
}

export class InvalidCallbackError extends Error {
  public name = 'InvalidCallbackError'

  constructor() {
    super()
    Object.setPrototypeOf(this, InvalidCallbackError.prototype)
    this.message = 'the parameter callback must be a function'
  }
}

export class InvalidHexStringError extends Error {
  public name = 'InvalidHexStringError'

  constructor(hex) {
    super()
    Object.setPrototypeOf(this, InvalidHexStringError.prototype)
    this.message = `Given value "${hex}" is not a valid hex string`
  }
}

export class InvalidNumberError extends Error {
  public name = 'InvalidNumberError'

  constructor(num) {
    super()
    Object.setPrototypeOf(this, InvalidNumberError.prototype)
    this.message = `Given value "${num}" is not a valid number`
  }
}

export class InvalidMnemonicError extends Error {
  public name = 'InvalidMnemonicError'

  constructor(mnemonic: string) {
    super()
    Object.setPrototypeOf(this, InvalidMnemonicError.prototype)
    this.message = `Given value "${mnemonic}" is not a valid mnemonic`
  }
}

export class UnsupportedSubscriptionsProviderError extends Error {
  public name = 'UnsupportedSubscriptionsProviderError'

  constructor(providerName: string) {
    super()
    Object.setPrototypeOf(this, UnsupportedSubscriptionsProviderError.prototype)
    this.message = `The provider doesn't support subscriptions: ${providerName}`
  }
}

export class OutOfRangeError extends Error {
  public name = 'OutOfRangeError'

  constructor(index: number) {
    super()
    Object.setPrototypeOf(this, OutOfRangeError.prototype)
    this.message = `The index ${index} is out of the array range`
  }
}

export class InvalidRequestManagerError extends Error {
  public name = 'InvalidRequestManagerError'
  constructor() {
    super()
    Object.setPrototypeOf(this, InvalidRequestManagerError.prototype)
    this.message = `The request manager is invalid`
  }
}

export class InvalidContractOptionsError extends Error {
  public name = 'InvalidContractOptionsError'
  constructor() {
    super()
    Object.setPrototypeOf(this, InvalidContractOptionsError.prototype)
    this.message = 'The contract options is invalid'
  }
}

export class InvalidContractAddressError extends Error {
  public name = 'InvalidContractAddressError'
  constructor(address: string) {
    super()
    Object.setPrototypeOf(this, InvalidContractAddressError.prototype)
    this.message = `Provided contract address "${address}" is invalid, the capitalization checksum test failed.`
  }
}

export default {
  ConnectionTimeoutError,
  DecryptAccountsError,
  InvalidAddressError,
  InvalidContractAddressError,
  InvalidCallbackError,
  InvalidConnectionError,
  InvalidContractOptionsError,
  InvalidHexStringError,
  InvalidMethodParamsError,
  InvalidMnemonicError,
  InvalidNumberError,
  InvalidPrivateKeyNumError,
  InvalidNumberOfParamsError,
  InvalidPasswordError,
  InvalidPrivateKeyError,
  InvalidProviderError,
  InvalidProviderPathError,
  InvalidRequestManagerError,
  InvalidResponseError,
  KeyDerivationError,
  NoInvalidPrivateExtendedKeyError,
  NoInvalidPrivateKeyError,
  OutOfRangeError,
  ResponseError,
  ToBigNumberError,
  UnsupportedCipherError,
  UnsupportedKdfError,
  UnsupportedParamsToPBKDF2Error,
  UnsupportedSubscriptionsProviderError,
  WrongMethodForParams,
  WrongResponseIdError
}
