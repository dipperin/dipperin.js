import Core from '../../core'
import { Provider } from '../../providers'
import rlp from '../../helper/rlp'
import { SignedTransactionResult } from '../../helper'
import { Accounts } from '../..'

const VmContractAddress = '0x00120000000000000000000000000000000000000000'

class VmContract extends Core {
  constructor(provider: Provider | string) {
    super(provider)
  }

  static createVmContract(
    wasmBytes: string,
    abiBytes: string,
    ...initParams: any[]
  ): string {
    return rlp.encode([wasmBytes, abiBytes, ...initParams])
  }

  static createDeployTransaction(
    nonce: string,
    gas: string,
    gasPrice: string,
    value: string,
    contractData: string,
    privateKey: string,
    chainId?: string
  ): SignedTransactionResult {
    return Accounts.signTransaction(
      {
        nonce,
        gas,
        gasPrice,
        value,
        extraData: contractData,
        to: VmContractAddress
      },
      privateKey,
      chainId
    )
  }
}

export default VmContract
