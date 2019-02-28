import Core from '../../core'
import Helper from '../../helper'
import { Provider, Callback } from '../../providers'

class Personal extends Core {
  constructor(provider: string | Provider) {
    super(provider)
  }

  newWallet: (
    password: string,
    passPhrase?: string,
    walletIdentifier?: string,
    cb?: Callback<string>
  ) => Promise<string> = this.buildCall({
    name: 'newWallet',
    call: 'chainstack_establishWallet',
    params: 3,
    inputFormatter: [
      null,
      Helper.Formatters.inputPlaceholderFormatter,
      Helper.Formatters.inputPlaceholderFormatter
    ]
  })

  openWallet: (
    password: string,
    walletIdentifier?: string,
    cb?: Callback<void>
  ) => Promise<void> = this.buildCall({
    name: 'openWallet',
    call: 'chainstack_openWallet',
    params: 2,
    inputFormatter: [null, Helper.Formatters.inputPlaceholderFormatter]
  })

  closeWallet: (
    walletIdentifier?: string,
    cb?: Callback<void>
  ) => Promise<void> = this.buildCall({
    name: 'closeWallet',
    call: 'chainstack_closeWallet',
    params: 1,
    inputFormatter: [Helper.Formatters.inputPlaceholderFormatter]
  })

  restoreWallet: (
    password: string,
    mnemonic: string,
    passPhrase?: string,
    walletIdentifier?: string,
    cb?: Callback<void>
  ) => Promise<void> = this.buildCall({
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

  listWalletAccount: (
    walletIdentifier?: string,
    cb?: Callback<string[]>
  ) => Promise<string[]> = this.buildCall({
    name: 'listWalletAccount',
    call: 'chainstack_listWalletAccount',
    params: 1
  })

  listAllWallet: (
    cb?: Callback<string[]>
  ) => Promise<string[]> = this.buildCall({
    name: 'listAllWallet',
    call: 'chainstack_listWallet',
    params: 0
  })

  addAccount: (
    derivationPath: string,
    walletIdentifier?: string,
    cb?: Callback<string>
  ) => Promise<string> = this.buildCall({
    name: 'addAccount',
    call: 'chainstack_addAccount',
    params: 2
  })

  send: (
    from: string,
    to: string,
    value: string,
    fee: string,
    nonce: number,
    cb?: Callback<string>
  ) => Promise<string> = this.buildCall({
    name: 'send',
    call: 'chainstack_sendTransaction',
    params: 5
  })
}

export default Personal
