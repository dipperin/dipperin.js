import Core from '../../core'
import Helper from '../../helper'

class Personal extends Core {
  constructor(provider, net?: any) {
    super(provider, net)
  }

  newWallet = this.buildCall({
    name: 'newWallet',
    call: 'chainstack_establishWallet',
    params: 3,
    inputFormatter: [
      null,
      Helper.Formatters.inputPlaceholderFormatter,
      Helper.Formatters.inputPlaceholderFormatter
    ]
  })

  openWallet = this.buildCall({
    name: 'openWallet',
    call: 'chainstack_openWallet',
    params: 2,
    inputFormatter: [null, Helper.Formatters.inputPlaceholderFormatter]
  })

  closeWallet = this.buildCall({
    name: 'closeWallet',
    call: 'chainstack_closeWallet',
    params: 1,
    inputFormatter: [Helper.Formatters.inputPlaceholderFormatter]
  })

  restoreWallet = this.buildCall({
    name: 'restoreWallet',
    call: 'chainstack_restoreWallet',
    params: 4,
    inputFormatter: [
      null,
      null,
      Helper.Formatters.inputPlaceholderFormatter,
      Helper.Formatters.inputPlaceholderFormatter
    ]
  })

  listWalletAccount = this.buildCall({
    name: 'listWalletAccount',
    call: 'chainstack_listWalletAccount',
    params: 1
  })

  listAllWallet = this.buildCall({
    name: 'listAllWallet',
    call: 'chainstack_listWallet',
    params: 1
  })

  getWalletAccounts = this.buildCall({
    name: 'getWalletAccounts',
    call: 'chainstack_curGetWalletAccount',
    params: 0
  })

  getWalletBalance = this.buildCall({
    name: 'getWalletBalance',
    call: 'chainstack_curGetWalletBalance',
    params: 0
  })

  addAccount = this.buildCall({
    name: 'addAccount',
    call: 'chainstack_addAccount',
    params: 2
  })

  send = this.buildCall({
    name: 'send',
    call: 'chainstack_sendTransaction',
    params: 4
  })
}

export default Personal
