import Errors from './errors'

describe('helper/errors', () => {
  it('ConnectionTimeoutError', () => {
    expect(() => {
      throw new Errors.ConnectionTimeoutError('10')
    }).toThrow('CONNECTION TIMEOUT: timeout of 10 ms achived')
  })

  it('InvalidConnectionError', () => {
    expect(() => {
      throw new Errors.InvalidConnectionError('host')
    }).toThrow(`CONNECTION ERROR: Couldn\'t connect to node host.`)
  })

  it('InvalidNumberOfParamsError', () => {
    expect(() => {
      throw new Errors.InvalidNumberOfParamsError('method', 1, 2)
    }).toThrow(
      `Invalid number of parameters for ${'method'}. Got ${1} expected ${2} !`
    )
  })

  it('InvalidProviderError', () => {
    expect(() => {
      throw new Errors.InvalidProviderError()
    }).toThrow(`Provider not set or invalid`)
  })

  it('ResponseError', () => {
    expect(() => {
      throw new Errors.ResponseError({
        error: {
          message: 'error'
        }
      })
    }).toThrow(`Returned error: "error"`)
  })

  it('InvalidResponseError', () => {
    expect(() => {
      throw new Errors.InvalidResponseError({
        error: {
          message: 'error'
        }
      })
    }).toThrow(`error`)
  })

  it('UnsupportedKdfError', () => {
    expect(() => {
      throw new Errors.UnsupportedKdfError()
    }).toThrow(`Unsupported kdf`)
  })

  it('UnsupportedCipherError', () => {
    expect(() => {
      throw new Errors.UnsupportedCipherError()
    }).toThrow(`Unsupported cipher`)
  })

  it('InvalidPasswordError', () => {
    expect(() => {
      throw new Errors.InvalidPasswordError()
    }).toThrow('Invalid password')
  })

  it('UnsupportedParamsToPBKDF2Error', () => {
    expect(() => {
      throw new Errors.UnsupportedParamsToPBKDF2Error()
    }).toThrow('Unsupported parameters to PBKDF2')
  })

  it('KeyDerivationError', () => {
    expect(() => {
      throw new Errors.KeyDerivationError()
    }).toThrow('Key derivation error, possibly wrong password')
  })

  it('InvalidMethodParamsError', () => {
    expect(() => {
      throw new Errors.InvalidMethodParamsError()
    }).toThrow(
      'When creating a method you need to provide at least the "name" and "call" property.'
    )
  })

  it('InvalidProviderPathError', () => {
    expect(() => {
      throw new Errors.InvalidProviderPathError('path')
    }).toThrow(`Can't autodetect provider for "path"`)
  })

  it('WrongResponseIdError', () => {
    expect(() => {
      throw new Errors.WrongResponseIdError(1, 2, {
        id: 2
      })
    }).toThrow(
      `Wrong response id 1 (expected: 2) in ${JSON.stringify({ id: 2 })}`
    )
  })

  it('WrongMethodForParams', () => {
    expect(() => {
      throw new Errors.WrongMethodForParams({})
    }).toThrow(
      `JSONRPC method should be specified for params: "${JSON.stringify({})}"!`
    )
  })

  it('DecryptAccountsError', () => {
    expect(() => {
      throw new Errors.DecryptAccountsError()
    }).toThrow("Couldn't decrypt accounts. Password wrong?")
  })

  it('InvalidAddressError', () => {
    expect(() => {
      throw new Errors.InvalidAddressError('address')
    }).toThrow(
      `Provided address "address" is invalid, the capitalization checksum test failed.`
    )
  })

  it('InvalidPrivateKeyError', () => {
    expect(() => {
      throw new Errors.InvalidPrivateKeyError('private key')
    }).toThrow(`Provided private key "private key" is invalid.`)
  })

  it('NoInvalidPrivateExtendedKeyError', () => {
    expect(() => {
      throw new Errors.NoInvalidPrivateExtendedKeyError()
    }).toThrow(`This is no valid private extended key.`)
  })

  it('NoInvalidPrivateKeyError', () => {
    expect(() => {
      throw new Errors.NoInvalidPrivateKeyError()
    }).toThrow(`This is no valid private key.`)
  })

  it('ToBigNumberError', () => {
    expect(() => {
      throw new Errors.ToBigNumberError(new Error('invalid'), 'num')
    }).toThrow(`invalid Given value: "num"`)
  })

  it('InvalidCallbackError', () => {
    expect(() => {
      throw new Errors.InvalidCallbackError()
    }).toThrow('the parameter callback must be a function')
  })

  it('InvalidHexStringError', () => {
    expect(() => {
      throw new Errors.InvalidHexStringError('hex')
    }).toThrow(`Given value "hex" is not a valid hex string`)
  })

  it('InvalidNumberError', () => {
    expect(() => {
      throw new Errors.InvalidNumberError('num')
    }).toThrow(`Given value "num" is not a valid number`)
  })

  it('InvalidMnemonicError', () => {
    expect(() => {
      throw new Errors.InvalidMnemonicError('mnemonic')
    }).toThrow(`Given value "mnemonic" is not a valid mnemonic`)
  })

  it('UnsupportedSubscriptionsProviderError', () => {
    expect(() => {
      throw new Errors.UnsupportedSubscriptionsProviderError('provider')
    }).toThrow(`The provider doesn't support subscriptions: provider`)
  })

  it('OutOfRangeError', () => {
    expect(() => {
      throw new Errors.OutOfRangeError(5)
    }).toThrow(`The index 5 is out of the array range`)
  })

  it('InvalidRequestManagerError', () => {
    expect(() => {
      throw new Errors.InvalidRequestManagerError()
    }).toThrow(`The request manager is invalid`)
  })
})
