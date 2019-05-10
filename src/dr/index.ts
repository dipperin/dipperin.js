import Core from '../core'
import Helper from '../helper'
import { Callback, Provider } from '../providers'
import Contract from './contract'
import Personal from './personal'
import Wallet from './wallet'

class DR extends Core {
  personal: Personal
  contract: Contract
  wallet: Wallet
  constructor(provider: string | Provider) {
    super(provider)

    this.contract = new Contract(provider)
    this.personal = new Personal(provider)
    this.wallet = new Wallet()
  }

  setProvider(provider: string | Provider): void {
    super.setProvider(provider)
    this.personal.setProvider(provider)
    this.contract.setProvider(provider)
  }

  getBalance: (
    address: string,
    cb?: Callback
  ) => Promise<string> = this.buildCall({
    call: 'dipperin_currentBalance',
    name: 'getBalance',
    inputFormatter: [Helper.Formatters.inputAddressFormatter],
    outputFormatter: Helper.Formatters.outputBalanceFormatter,
    params: 1
  })

  getLockedMoney: (
    address: string,
    cb?: Callback
  ) => Promise<string> = this.buildCall({
    call: 'dipperin_getAddressLockMoney',
    name: 'getAddressLockedMonery',
    inputFormatter: [Helper.Formatters.inputAddressFormatter],
    outputFormatter: Helper.Formatters.outputLockMoneyFormatter,
    params: 1
  })

  getNonce: (
    address: string,
    cb?: Callback
  ) => Promise<string> = this.buildCall({
    call: 'dipperin_getTransactionNonce',
    name: 'getNonce',
    inputFormatter: [Helper.Formatters.inputAddressFormatter],
    outputFormatter: Helper.Formatters.outputNonceFormatter,
    params: 1
  })

  getCurrentBlock: (cb?: Callback) => Promise<any> = this.buildCall({
    call: 'dipperin_currentBlock',
    name: 'getCurrentBlock',
    params: 0
  })

  getTransaction: (
    hash: string,
    cb?: Callback
  ) => Promise<any> = this.buildCall({
    call: 'dipperin_transaction',
    name: 'getTransaction',
    params: 1
  })

  sendSignedTransaction: (
    hash: string,
    cb?: Callback
  ) => Promise<string | { error: { message: string } }> = this.buildCall({
    call: 'dipperin_newTransaction',
    inputFormatter: [Helper.Formatters.inputHashFormatter],
    name: 'sendSignedTransaction',
    params: 1
  })

  setMineCoinbase = this.buildCall({
    call: 'dipperin_setMineCoinBase',
    name: 'setMineCoinbase',
    params: 1
  })

  subscribeBlock = this.subscribe({
    subscriptionName: 'subscribeBlock',
    paramsNum: 0
  })
}

export default DR
