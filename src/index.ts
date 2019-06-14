import Package from './core'
import DR from './dr'
import Net from './net'
import { Provider } from './providers'
import Utils from './utils'

class Dipperin extends Package {
  utils: any
  dr: DR
  net: Net

  constructor(provider: string | Provider) {
    super(provider)
    this.utils = Utils
    this.dr = new DR(provider)
    this.net = new Net(provider)
  }
  setProvider(provider: string | Provider): void {
    super.setProvider(provider)
    this.dr.setProvider(provider)
    this.net.setProvider(provider)
  }
}

export default Dipperin

export { default as Providers } from './providers'
export { default as Utils } from './utils'
export { default as Accounts } from './dr/accounts'
export { default as Transaction } from './dr/transaction'
export { default as Contract } from './dr/contract'
export { default as Wallet } from './dr/wallet'
export { default as net } from './net'
export { default as helper } from './helper'
export * from './providers'
export * from './utils'
export * from './dr/accounts'
export * from './dr/transaction'
export * from './dr/wallet'
export * from './net'
