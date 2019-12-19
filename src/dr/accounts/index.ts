import cryp from 'crypto'
import { isNil, isObject, isBoolean, isBuffer, isString, extend } from 'lodash'
import scryptsy from 'scryptsy'
import uuid from 'uuid'
import Helper, { SignedTransactionResult, TransactionData } from '../../helper'
import Utils from '../../utils'
import Transaction from '../transaction'
import Account from './account'

const EXTENDED_KEY_LENGTH = 111
const SEED_LENGTHS = [128, 256, 512]

/**
 * abstract Accounts class
 */
class Accounts {
  /**
   * Create a account object by entropy
   *
   * ### Example
   * ```js
   * Accounts.create(entropy)
   * // => [Object Account]
   * ```
   * @param entropy seed or extended key or mnemonic or null
   * @return HD-Account
   */
  static create(entropy?: string): AccountObject {
    if (isNil(entropy)) {
      return this.addAccountFunctions(new Account())
    } else if (
      Utils.isHex(entropy) &&
      SEED_LENGTHS.includes(entropy.replace('0x', '').length)
    ) {
      // is valid seed
      return this.fromSeed(entropy)
    } else if (entropy.length === EXTENDED_KEY_LENGTH) {
      // is valid extended key
      return this.fromExtendedKey(entropy)
    }
    return this.addAccountFunctions(new Account())
  }

  /**
   * Return account object by mnemonic
   *
   * ### Example
   * ```js
   * Accounts.fromExtendedKey('xprv9s21ZrQH143K4XtJWPuM421RYzNoQKGJi29eVSM2pHTj1wtM5dBbFwhJ5D7QHFaaQ8A7yY7THs43D2dwvZ5fYdbo9k4xzSqQUB1u6mxfe4m')
   * // => [Object: Account]
   * ```
   *
   * @param mnemonic  mnemonic
   * @return HD-Account
   */
  static fromExtendedKey(extendedKey: string): AccountObject {
    return this.addAccountFunctions(
      new Account({
        extendedKey
      })
    )
  }

  /**
   * Return account object by mnemonic
   *
   * ### Example
   * ```js
   * Accounts.fromExtendedKey('0x1457fff042637cf08e36424a1ebcc8a185bb7a9b02e7899666ff3829fbea16f79d1156aea347e8ed9695d1f64c04ea30b1faf5cda9b27eb2bf3db7dca94fe318')
   * // => [Object: Account]
   * ```
   *
   * @param seed  seed
   * @return HD-Account
   */
  static fromSeed(seed: string): AccountObject {
    if (!Utils.isHexStrict(seed)) {
      throw new Helper.Errors.InvalidHexStringError(seed)
    }

    return this.addAccountFunctions(
      new Account({
        seed
      })
    )
  }

  /**
   *  Sign an transaction
   */
  static signTransaction(
    transactionData: TransactionData,
    privateKey: string,
    chainId?: string
  ): SignedTransactionResult {
    const transaction = new Transaction({
      txData: transactionData
    })

    transaction.sign(privateKey, chainId)

    return transaction.getSignedTransaction()
  }

  /**
   * Get transaction fee
   */
  static getTransactionFee(transactionData: TransactionData): string {
    const transaction = new Transaction({
      txData: transactionData
    })
    return transaction.getFee()
  }

  /**
   * Recover from a signed transaction
   *
   * @param raw transaction raw
   */
  static recoverTransaction(raw: string): string {
    const rawTx = Transaction.unserialize(raw)
    return rawTx.recover()
  }

  /**
   *  Hash data
   *
   * ### Example
   * ```js
   * Accounts.hashMessage('some data')
   * => 0x3b9d51379da4f56cb55ca3e7f7ca92c8798b1d25abe0d6a6abab50b135e7794e
   * ```
   *
   * @param data  data used to hash
   * @return the hash of the data
   */
  static hashMessage(data): string {
    const message = Utils.isHexStrict(data) ? Utils.hexToBytes(data) : data
    const messageBuffer = Buffer.from(message)
    // const preamble = `\x19Dipperin Signed Message:\n${message.length}`
    // const preambleBuffer = Buffer.from(preamble)
    // const ethMessage = Buffer.concat([preambleBuffer, messageBuffer])
    return Helper.Hash.keccak256(messageBuffer)
  }

  /**
   * Use private key to sign an data
   *
   * ### Example
   * ```js
   * Accounts.sign('Some data', '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728')
   * // => {
   * // message: 'Some data',
   * // messageHash: '0x3b9d51379da4f56cb55ca3e7f7ca92c8798b1d25abe0d6a6abab50b135e7794e',
   * // r: '0x123476d36992bdef82362488eb00a154b52284cc0ccec330227f6d3b2b8d763d',
   * // s: '0x6d9e18d574a01d519024b91e4193d43fd94e806bc6b0c35941e36dd0a79f0b97',
   * // v: '0x1c',
   * // signature: '0x123476d36992bdef82362488eb00a154b52284cc0ccec330227f6d3b2b8d763d6d9e18d574a01d519024b91e4193d43fd94e806bc6b0c35941e36dd0a79f0b971c'
   * // }
   * ```
   *
   * @param data  data used to sign
   * @param privateKey  private key
   * @return a sign result
   */
  static sign(data, privateKey: string, addToValue?: number): SignResult {
    const hash = this.hashMessage(data)
    const signature: string = addToValue
      ? Helper.Account.makeSigner(addToValue)(hash, privateKey)
      : Helper.Account.sign(hash, privateKey)
    const vrs = Helper.Account.decodeSignature(signature)
    return {
      message: data,
      messageHash: hash,
      r: vrs[1],
      s: vrs[2],
      signature,
      v: vrs[0]
    }
  }

  /**
   * Recover a address from signature and message
   *
   * ### Example
   * ```js
   * Accounts.recover('Some data', '0x123476d36992bdef82362488eb00a154b52284cc0ccec330227f6d3b2b8d763d6d9e18d574a01d519024b91e4193d43fd94e806bc6b0c35941e36dd0a79f0b971c')
   * // => 0xEB014f8c8B418Db6b45774c326A0E64C78914dC0
   * ```
   *
   * @param message
   * @param signature
   * @param prefixed  whether to use already hash data to recover address
   * @return a address
   *
   */
  static recover(message: string, signature: string, prefixed?: boolean): string
  /**
   * Recover a address from v, r, s
   *
   * ### Example
   * ```js
   * Accounts.recover('Some data', '0x1c', '0x123476d36992bdef82362488eb00a154b52284cc0ccec330227f6d3b2b8d763d', '0x6d9e18d574a01d519024b91e4193d43fd94e806bc6b0c35941e36dd0a79f0b97')
   * // => 0xEB014f8c8B418Db6b45774c326A0E64C78914dC0
   * ```
   *
   * @param message
   * @param v
   * @param r
   * @param s
   * @param prefixed  whether to use already hash data to recover address
   * @return a address
   *
   */
  static recover(
    message: string,
    v: string,
    r: string,
    s: string,
    prefixed?: boolean
  ): string
  /**
   * Recover a address from sig object
   *
   * ### Example
   * ```js
   * Accounts.recover(sig)
   * // => 0xEB014f8c8B418Db6b45774c326A0E64C78914dC0
   * ```
   *
   * @param sig  a signature object that have hash message and v, r ,s
   * @return a address
   *
   */
  static recover(sig: object): string

  static recover(...args: any[]): string {
    let msg = args[0]
    const signature = args[1]
    let prefixed = args[2]

    if (isObject(msg)) {
      return this.recover(
        msg.messageHash,
        Helper.Account.encodeSignature([msg.v, msg.r, msg.s]),
        true
      )
    }
    if (!prefixed) {
      msg = this.hashMessage(msg)
    }

    if (args.length >= 4) {
      prefixed = args[args.length - 1]
      prefixed = isBoolean(prefixed) ? !!prefixed : false

      return this.recover(
        msg,
        Helper.Account.encodeSignature(args.slice(1, 4)),
        prefixed
      ) // v, r, s
    }

    return Helper.Account.recover(msg, signature)
  }

  /**
   * Encrypt a seed
   *
   * ### Example
   * ```js
   * Accounts.encrypt(seed, password, options)
   * // => {address: '...', ...}
   * ```
   *
   * @param seed  seed  use to encrypt
   * @param password   password use to encrypt
   * @param options  some encrypt options
   * @return a encrypt result
   */
  static encrypt(
    seed: string,
    password: string,
    options: EncryptOptions = {}
  ): EncryptResult {
    const account = this.fromSeed(seed)

    const salt: Buffer = options.salt
      ? Utils.hexToBuffer(options.salt)
      : cryp.randomBytes(32)

    const iv: Buffer = options.iv
      ? Utils.hexToBuffer(options.iv)
      : cryp.randomBytes(16)

    let derivedKey
    const kdf = options.kdf || 'scrypt'
    const kdfparams = {
      c: undefined,
      dklen: options.dklen || 32,
      n: undefined,
      p: undefined,
      prf: '',
      r: undefined,
      salt: salt.toString('hex')
    }

    if (kdf === 'pbkdf2') {
      kdfparams.c = options.c || 262144
      kdfparams.prf = 'hmac-sha256'
      derivedKey = cryp.pbkdf2Sync(
        Buffer.from(password),
        salt,
        kdfparams.c,
        kdfparams.dklen,
        'sha256'
      )
    } else if (kdf === 'scrypt') {
      kdfparams.n = options.n || 8192 // 2048 4096 8192 16384
      kdfparams.r = options.r || 8
      kdfparams.p = options.p || 1
      derivedKey = scryptsy(
        password,
        salt,
        kdfparams.n,
        kdfparams.r,
        kdfparams.p,
        kdfparams.dklen
      )
    } else {
      throw new Helper.Errors.UnsupportedKdfError()
    }

    const cipher = cryp.createCipheriv(
      options.cipher || 'aes-128-ctr',
      derivedKey.slice(0, 16),
      iv
    )

    if (!cipher) {
      throw new Helper.Errors.UnsupportedCipherError()
    }
    const cipherText = Buffer.concat([
      cipher.update(Buffer.from(seed.replace('0x', ''), 'hex')),
      cipher.final()
    ])
    const mac = Utils.sha3(
      Buffer.concat([derivedKey.slice(16, 32), cipherText])
    ).replace('0x', '')

    return {
      address: account.address.toLowerCase().replace('0x', ''),
      crypto: {
        cipher: options.cipher || 'aes-128-ctr',
        cipherparams: {
          iv: iv.toString('hex')
        },
        ciphertext: cipherText.toString('hex'),
        kdf,
        kdfparams,
        mac
      },
      id: uuid.v4({
        random: isBuffer(options.uuid)
          ? (options.uuid as Buffer).toJSON().data
          : isString(options.uuid)
            ? Buffer.from(options.uuid, 'hex').toJSON().data
            : cryp.randomBytes(16).toJSON().data
      }),
      version: 1
    }
  }

  /**
   * Decrypt a keystore
   *
   * ### Example
   * ```js
   * Accounts.decrypt(keystore, password)
   * // => [Object Account]
   * ```
   *
   * @param keystore
   * @param password
   * @return account object
   */
  static decrypt(
    keystore: EncryptResult | string,
    password: string,
    nonStrict?: boolean
  ): AccountObject {
    if (!isString(password)) {
      throw new Helper.Errors.InvalidPasswordError()
    }

    const json = isString(keystore)
      ? JSON.parse(nonStrict ? keystore.toLowerCase() : keystore)
      : keystore

    let derivedKey
    let kdfparams

    const salt: Buffer = Utils.hexToBuffer(json.crypto.kdfparams.salt)
    const iv: Buffer = Utils.hexToBuffer(json.crypto.cipherparams.iv)

    if (json.crypto.kdf === 'scrypt') {
      kdfparams = json.crypto.kdfparams

      derivedKey = scryptsy(
        password,
        salt,
        kdfparams.n,
        kdfparams.r,
        kdfparams.p,
        kdfparams.dklen
      )
    } else if (json.crypto.kdf === 'pbkdf2') {
      kdfparams = json.crypto.kdfparams

      if (kdfparams.prf !== 'hmac-sha256') {
        throw new Helper.Errors.UnsupportedParamsToPBKDF2Error()
      }

      derivedKey = cryp.pbkdf2Sync(
        Buffer.from(password),
        salt,
        kdfparams.c,
        kdfparams.dklen,
        'sha256'
      )
    } else {
      throw new Helper.Errors.UnsupportedKdfError()
    }

    const ciphertext = Buffer.from(json.crypto.ciphertext, 'hex')

    const mac = Utils.sha3(
      Buffer.concat([derivedKey.slice(16, 32), ciphertext])
    ).replace('0x', '')

    if (mac !== json.crypto.mac) {
      throw new Helper.Errors.KeyDerivationError()
    }

    const decipher = cryp.createDecipheriv(
      json.crypto.cipher,
      derivedKey.slice(0, 16),
      iv
    )
    const seed = `0x${Buffer.concat([
      decipher.update(ciphertext),
      decipher.final()
    ]).toString('hex')}`

    return this.fromSeed(seed)
  }

  static addAccountFunctions(account: Account): AccountObject {
    extend(account, {
      encrypt: (password, options) =>
        this.encrypt(account.seed, password, options),
      sign: data => this.sign(data, account.privateKey),
      signTransaction: (txData: TransactionData, path: string) => {
        this.signTransaction(txData, account.derivePath(path).privateKey)
      }
    })
    return account as AccountObject
  }
}

export default Accounts

export interface AccountObject extends Account {
  encrypt: (password: string, options?: EncryptOptions) => EncryptResult
  sign: (data) => SignResult
  signTransaction: () => any
}

/**
 * encrypt options interface
 */
export interface EncryptOptions {
  c?: number // PBKDF2 interations
  salt?: string | Buffer // key derived function salt
  iv?: string | Buffer // cipher initialization vector
  kdf?: string // key derived function
  dklen?: number // Intended output length in octets of the derived key
  n?: number // CPU/memory cost parameter
  r?: number // The blocksize parameter, which fine-tunes sequential memory read size and performance. 8 is commonly used
  p?: number // Parallelization parameter
  cipher?: string // cipher method
  uuid?: Buffer | string // uuid
}

/**
 * a encrypt result, same as encrypt options
 */
export interface EncryptResult {
  address: string
  crypto: {
    cipher: string
    cipherparams: {
      iv: string | Buffer
    }
    ciphertext: string
    kdf: string
    kdfparams: {
      c: string
      dklen: number
      n: string
      p: string
      prf: string
      r: string
      salt: string | Buffer
    }
    mac: string
  }
  id: string
  version: number
}
/**
 * signed result
 */
export interface SignResult {
  message: any
  messageHash: string
  r: string
  s: string
  signature: string
  v: string
}
