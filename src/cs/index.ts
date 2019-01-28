import Core from '../core'
import Helper from '../helper'
import { Provider, Callback } from '../providers'
import Personal from './personal'
import Wallet from './wallet'
import Contract from './contract'

class CS extends Core {
  personal: Personal
  contract: Contract
  wallet: Wallet
  constructor(provider, net?: any) {
    super(provider, net)

    this.contract = new Contract(provider, net)
    this.personal = new Personal(provider, net)
    this.wallet = new Wallet()
  }

  setProvider(provider: string | Provider, net?: any): void {
    super.setProvider(provider, net)
    this.personal.setProvider(provider, net)
  }

  getBalance: (
    address: string,
    cb?: Callback
  ) => Promise<string> = this.buildCall({
    call: 'chainstack_currentBalance',
    name: 'getBalance',
    inputFormatter: [Helper.Formatters.inputAddressFormatter],
    outputFormatter: Helper.Formatters.outputBalanceFormatter,
    params: 1
  })

  getNonce: (
    address: string,
    cb?: Callback
  ) => Promise<string> = this.buildCall({
    call: 'chainstack_getTransactionNonce',
    name: 'getNonce',
    inputFormatter: [Helper.Formatters.inputAddressFormatter],
    outputFormatter: Helper.Formatters.outputNonceFormatter,
    params: 1
  })

  getCurrentBlock: (cb?: Callback) => Promise<any> = this.buildCall({
    call: 'chainstack_currentBlock',
    name: 'getCurrentBlock',
    params: 0
  })

  getTransaction: (
    hash: string,
    cb?: Callback
  ) => Promise<any> = this.buildCall({
    call: 'chainstack_transaction',
    name: 'getTransaction',
    params: 1
  })

  sendSignedTransaction: (
    hash: string,
    cb?: Callback
  ) => Promise<string> = this.buildCall({
    call: 'chainstack_newTransaction',
    inputFormatter: [Helper.Formatters.inputHashFormatter],
    name: 'sendSignedTransaction',
    params: 1
  })

  setMineCoinbase = this.buildCall({
    call: 'chainstack_setMineCoinBase',
    name: 'setMineCoinbase',
    params: 1
  })

  subscribeBlock = this.subscribe({
    subscriptionName: 'subscribeBlock',
    paramsNum: 0
  })
}

export default CS
