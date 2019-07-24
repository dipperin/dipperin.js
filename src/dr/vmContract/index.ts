import _ from 'lodash'
import Core from '../../core'
import { Provider, Callback } from '../../providers'
import rlp from '../../helper/rlp'
import { SignedTransactionResult } from '../../helper'
import { Accounts } from '../..'
import Bytes from '../../helper/bytes'
import utils from '../../utils'

const VmContractAddress = '0x00120000000000000000000000000000000000000000'

const INIT_ABI = 'init'

class VmContract extends Core {
  constructor(provider: Provider | string) {
    super(provider)
  }

  static createVmContract(
    wasmBytes: string,
    abiBytes: string,
    ...initParams: string[]
  ): string {
    const abis = VmContract.convertAbiStrToAbiJSON(abiBytes)
    const params = initParams.map((param, index) => {
      const initAbi = abis.find(abi => abi.name === INIT_ABI)!
      return utils.typeStringToBytes(param, initAbi.inputs[index].type)
    })
    return rlp.encode([wasmBytes, abiBytes, ...params])
  }

  static decodeVmContract(
    rlpData: string
  ): {
    wasmBytes: string
    abiBytes: string
    params: string[]
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

  static createCallMethod(
    abiBytes: string,
    funcName: string,
    ...callParams: string[]
  ): string {
    const abis = VmContract.convertAbiStrToAbiJSON(abiBytes)
    const params = callParams.map((param, index) => {
      const abi = abis.find(abi => abi.name === funcName)!
      return utils.typeStringToBytes(param, abi.inputs[index].type)
    })
    return rlp.encode([Bytes.fromString(funcName), ...params])
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

  static convertAbiStrToAbiJSON(str: string): ABI[] {
    const bytes = Bytes.toArray(str)
    const jsonStr = String.fromCharCode.apply(String, bytes)
    return JSON.parse(jsonStr)
  }

  getContractByHash: (
    hash: string,
    cb?: Callback
  ) => Promise<string> = this.buildCall({
    call: 'dipperin_getContractAddressByTxHash',
    name: 'getContractByHash',
    params: 1
  })

  getReceiptByTxHash: (
    hash: string,
    cb?: Callback
  ) => Promise<any> = this.buildCall({
    call: 'dipperin_getConvertReceiptByTxHash',
    name: 'getReceiptByTxHash',
    params: 1
  })

  constantCallContract: (
    from: string,
    to: string,
    data: string,
    blockNum: number
  ) => Promise<any> = this.buildCall({
    call: 'dipperin_callContract',
    name: 'constantCallContract',
    params: 4
  })
}

interface ABI {
  name: string
  constant: 'true' | 'false'
  inputs: Param[]
  outputs: Param[]
  type: 'function' | 'event'
}

type ParamType =
  | 'int16'
  | 'uint16'
  | 'int32'
  | 'int'
  | 'uint32'
  | 'uint'
  | 'int64'
  | 'uint64'
  | 'float32'
  | 'float64'
  | 'bool'
interface Param {
  name: string
  type: ParamType
}

export default VmContract
