import { isNumber, isNil } from 'lodash'
import Helper from '../../helper'
import Accounts, {
  AccountObject,
  EncryptOptions,
  EncryptResult
} from '../accounts'
import Account from '../accounts/account'

export interface WalletAccountObject extends AccountObject {
  index: number
}

class Wallet {
  length: number // wallet accounts length
  indexAccounts: Map<number, WalletAccountObject> // index accounts map
  addrsAccounts: Map<string, WalletAccountObject> // address accounts map
  checkAddrsAccounts: Map<string, WalletAccountObject> // lower case address accounts

  constructor() {
    this.length = 0

    this.indexAccounts = new Map<number, WalletAccountObject>()
    this.addrsAccounts = new Map<string, WalletAccountObject>()
    this.checkAddrsAccounts = new Map<string, WalletAccountObject>()
  }

  /**
   * Get account by the index or address
   *
   * ### Example
   * ```js
   * chainstack.cs.wallet.getAccounts(indexOrAddress)
   * // =>
   * ```
   * @param indexOrAddress
   */
  getAccounts(indexOrAddress: number | string): WalletAccountObject {
    return isNumber(indexOrAddress)
      ? this.indexAccounts.get(indexOrAddress)
      : this.addrsAccounts.get(indexOrAddress)
        ? this.addrsAccounts.get(indexOrAddress)
        : this.checkAddrsAccounts.get(indexOrAddress)
  }

  /**
   * Create a certain number of accounts
   *
   * ### Example
   * ```js
   * chainstack.cs.wallet.create(count, entropy)
   * // => Wallet
   * ```
   *
   * @param numberOfAccounts
   * @param entropy
   */
  create(numberOfAccounts: number): this {
    Array(numberOfAccounts)
      .fill(null)
      .forEach(_ => {
        this.add(Accounts.create())
      })
    return this
  }

  /**
   * Add a account to the wallet by private key or account object
   *
   * ### Example
   * ```js
   * chainstack.cs.wallet.add(privateKey)
   * => [Account Object]
   * ```
   *
   * @param account  private key or account object
   */
  add(account): WalletAccountObject {
    let acc = account
    if (!(acc instanceof Account)) {
      acc = Accounts.create(acc)
    }

    if (!this.addrsAccounts.has(acc.address)) {
      acc.index = this.findSafeIndex()

      this.indexAccounts.set(acc.index, acc)
      this.addrsAccounts.set(acc.address, acc)
      this.checkAddrsAccounts.set(acc.address.toLowerCase(), acc)

      this.length++

      return acc
    } else {
      return this.addrsAccounts.get(acc.address)
    }
  }

  /**
   * Remove a account of wallet accounts by address or index
   *
   * ### Example
   * ```js
   * chainstack.cs.wallet.remove(indexOrAddress)
   * ```
   *
   * @param indexOrAddress
   */
  remove(indexOrAddress: number | string): boolean {
    const account = this.getAccounts(indexOrAddress)

    if (!isNil(account)) {
      // address
      this.addrsAccounts.delete(account.address)
      // address lowercase
      this.checkAddrsAccounts.delete(account.address.toLowerCase())
      // index
      this.indexAccounts.delete(account.index)

      this.length--

      return true
    } else {
      return false
    }
  }

  /**
   * Clear all account of wallet accounts
   *
   * ### Example
   * ```js
   * chainstack.cs.wallet.clear()
   * ```
   */
  clear(): this {
    this.indexAccounts.clear()
    this.addrsAccounts.clear()
    this.checkAddrsAccounts.clear()
    this.length = 0
    return this
  }

  /**
   * Decrypt the encrypted wallet accounts array and add to wallet accounts
   *
   * ### Example
   * ```js
   * chainstack.cs.wallet.decrypt([EncryptResult, ...], password)
   * ```
   *
   * @param encryptedWallet
   * @param password
   */
  decrypt(encryptedWallet: EncryptResult[], password: string): this {
    encryptedWallet.forEach(keystore => {
      const account = Accounts.decrypt(keystore, password)

      if (account) {
        this.add(account)
      } else {
        throw new Helper.Errors.DecryptAccountsError()
      }
    })

    return this
  }

  /**
   * Return a encryped result of the wallet accounts
   *
   * ### Example
   * ```js
   * chainstack.cs.accounts.wallet.encrypt(password, encryptOptions)
   * // => [EncryptResult, ...]
   * ```
   *
   * @param password encrypte password
   * @param options encrypt options
   * @return a encrypted result of the accounts
   */
  encrypt(password: string, options?: EncryptOptions): EncryptResult[] {
    const encryptResults = []
    this.indexAccounts.forEach(account => {
      encryptResults.push(account.encrypt(password, options))
    })
    return encryptResults
  }

  private findSafeIndex(): number {
    return this.indexAccounts.size + 1
  }
}

export default Wallet
