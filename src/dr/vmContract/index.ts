import _ from 'lodash'
import Core from '../../core'
import { Provider, Callback } from '../../providers'
import rlp from '../../helper/rlp'
import { SignedTransactionResult } from '../../helper'
import { Accounts, Utils } from '../..'

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
    return rlp.encode([
      wasmBytes,
      abiBytes,
      ...initParams.map(
        param =>
          _.isNumber(param)
            ? Utils.formatNumberToHex(param)
            : Utils.formatUtf8ToHex(param)
      )
    ])
  }

  static decodeVmContract(
    rlpData: string
  ): {
    wasmBytes: string
    abiBytes: string
    params: any[]
  } {
    const data = rlp.decode(rlpData) as any[]
    const [wasmBytes, abiBytes, ...params] = data
    return {
      wasmBytes,
      abiBytes,
      params
    }
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

  static createCallMethod(funcName: string, ...params: any[]): string {
    return rlp.encode([
      Utils.formatUtf8ToHex(funcName),
      ...params.map(
        param =>
          _.isNumber(param)
            ? Utils.formatNumberToHex(param)
            : Utils.formatUtf8ToHex(param)
      )
    ])
  }

  static createCallMethodTransaction(
    contractAddress: string,
    nonce: string,
    gas: string,
    gasPrice: string,
    value: string,
    methodData: string,
    privateKey: string,
    chainId?: string
  ): SignedTransactionResult {
    return Accounts.signTransaction(
      {
        nonce,
        gas,
        gasPrice,
        value,
        extraData: methodData,
        to: contractAddress
      },
      privateKey,
      chainId
    )
  }

  getContractByHash: (
    hash: string,
    cb?: Callback
  ) => Promise<string> = this.buildCall({
    call: 'dipperin_getContractAddressByTxHash',
    name: 'getVmContractByHash',
    params: 1
  })
}

export default VmContract
