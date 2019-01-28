import Package from './core'
import CS from './cs'
import Net from './net'
import { Provider } from './providers'
import Utils from './utils'

class ChainStack extends Package {
  utils: any
  cs: CS
  net: Net

  constructor(provider: string | Provider, net?: any) {
    super(provider, net)
    this.utils = Utils
    this.cs = new CS(provider, net)
    this.net = new Net(provider, net)
  }
  setProvider(provider: string | Provider, net?: any): void {
    super.setProvider(provider, net)
    this.cs.setProvider(provider, net)
    this.net.setProvider(provider, net)
  }
}

export default ChainStack

export { default as Providers } from './providers'
export { default as Utils } from './utils'
export { default as Accounts } from './cs/accounts'
export { default as Transaction } from './cs/transaction'
export { default as Contract } from './cs/contract'
export { default as Wallet } from './cs/wallet'
export { default as net } from './net'
export { default as helper } from './helper'
export * from './providers'
export * from './utils'
export * from './cs/accounts'
export * from './cs/transaction'
export * from './cs/wallet'
export * from './net'
