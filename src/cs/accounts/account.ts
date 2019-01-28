import cryp from 'crypto'
import hdKey from 't-hd-key'
import { isNil } from 'lodash'
import Helper from '../../helper'

class Account {
  private _seed: string
  private _hdKey: hdKey

  constructor(config: HDAccountConfig = {}) {
    if (config.seed) {
      this.initFromSeed(config.seed)
    } else if (config.extendedKey) {
      this.initFromExtendedKey(config.extendedKey)
    } else if (config.hdKeyObject) {
      this.initFromHDKey(config.hdKeyObject)
    } else {
      this.initFromSeed(cryp.randomBytes(128).toString('hex'))
    }
  }
  get seed(): string {
    if (isNil(this._seed)) {
      return null
    }
    return `0x${this._seed}`
  }

  get privateKey(): string {
    if (isNil(this._hdKey.privateKey)) {
      return null
    }
    return `0x${this._hdKey.privateKey.toString('hex')}`
  }

  get publicKey(): string {
    return `0x${this._hdKey.publicKey.toString('hex')}`
  }

  get address(): string {
    return Helper.Account.fromPublic(this._hdKey.publicKey.toString('hex'))
  }

  get privateExtendedKey(): string {
    if (isNil(this._hdKey.privateExtendedKey)) {
      return null
    }
    return this._hdKey.privateExtendedKey
  }

  get publicExtendedKey(): string {
    return this._hdKey.publicExtendedKey
  }
  /**
   * derive the private key from the path
   *
   * ### Example
   * ```js
   * const newAccount = accountInstance.derivePath("m/44'/1")
   * // => [Object Account]
   * ```
   * @param path
   */
  derivePath(path: string): Account {
    return this.fromHDKey(this._hdKey.derive(path))
  }

  /**
   * derive the private key from the index
   *
   * ### Example
   * ```js
   * const newAccount = accountInstance.deriveChild(1)
   * // => [Object Account]
   * ```
   * @param path
   */
  deriveChild(index: number): Account {
    return this.fromHDKey(this._hdKey.deriveChild(index))
  }

  private fromHDKey(hdKeyObject: hdKey): Account {
    return new Account({
      hdKeyObject
    })
  }

  private initFromSeed(seed: string): void {
    this._seed = seed.replace('0x', '')
    this._hdKey = hdKey.fromMasterSeed(Buffer.from(this._seed, 'hex'))
  }

  private initFromExtendedKey(extendedKey: string): void {
    this._seed = null
    this._hdKey = hdKey.fromExtendedKey(extendedKey)
  }

  private initFromHDKey(hdKeyObject: hdKey): void {
    this._seed = null
    this._hdKey = hdKeyObject
  }
}

export interface HDAccountConfig {
  extendedKey?: string
  hdKeyObject?: hdKey
  seed?: string
}

export default Account
