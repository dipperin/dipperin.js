import Core from '../../core'
import Accounts from '../accounts'
import Helper, { SignedTransactionResult, TransactionData } from '../../helper'
import Utils from '../../utils'
import { Callback, Provider } from '../../providers'

const CONTRACT_TYPE_ERC20 = 'ERC20'

// FIXME: Now only support ERC20

class Contract extends Core {
  constructor(provider: Provider | string, net?: any) {
    super(provider, net)
  }

  /**
   * Creat contract
   *
   * @param contractType
   * @param options
   * @param contractAddress
   *
   * @return Contract data and contract address
   */
  static createContract(
    options: ContractOptions,
    contractType: string,
    contractAddress?: string
  ): ContractResult {
    this.checkContractOptions(options, contractType)

    const validContractAddress = contractAddress
      ? contractAddress
      : Helper.Account.genContractAddress()

    if (!Utils.isContractAddress(validContractAddress)) {
      throw new Helper.Errors.InvalidContractAddressError(validContractAddress)
    }

    options.tokenTotalSupply = Utils.isHexStrict(options.tokenTotalSupply)
      ? options.tokenTotalSupply
      : Utils.numberToHex(options.tokenTotalSupply)

    const contractParams: ContractParams = {
      owner: options.owner,
      token_name: options.tokenName,
      token_decimals: options.tokenDecimals,
      token_symbol: options.tokenSymbol,
      token_total_supply: options.tokenTotalSupply,
      balances: {
        [options.owner]: options.tokenTotalSupply
      },
      allowed: {}
    }

    const contractData: ContractData = {
      action: 'create',
      contract_address: validContractAddress,
      params: JSON.stringify(contractParams)
    }

    return {
      contractData: JSON.stringify(contractData),
      contractAddress: validContractAddress
    }
  }

  /**
   * Create contract deploy transaction
   *
   * @param transactionResult TransactionResult
   * @param privateKey
   */
  static createDeployContractTransaction(
    transactionData: TransactionData,
    privateKey: string,
    chainId?: string
  ): SignedTransactionResult {
    return Accounts.signTransaction(transactionData, privateKey, chainId)
  }

  /**
   * Create contract call transaction
   *
   * @param txIns
   * @param txOuts
   * @param callData
   * @param privateKeys
   */
  createContactCallTransaction(
    transactionData: TransactionData,
    privateKey: string,
    chainId?: string
  ): SignedTransactionResult {
    return Accounts.signTransaction(transactionData, privateKey, chainId)
  }

  /**
   * Get contract transfer call method
   *
   * @param contractAddress
   * @param to
   * @param value
   */
  getTransferCall(contractAddress: string, to: string, value: string): string {
    return this.callContractMethod('Transfer', contractAddress, [
      to,
      Utils.isHexStrict(value) ? value : Utils.numberToHex(value)
    ])
  }

  /**
   * Get contract transfer from call method
   *
   * @param contractAddress
   * @param from
   * @param to
   * @param value
   */
  getTransferFromCall(
    contractAddress: string,
    from: string,
    to: string,
    value: string
  ): string {
    return this.callContractMethod('TransferFrom', contractAddress, [
      from,
      to,
      Utils.isHexStrict(value) ? value : Utils.numberToHex(value)
    ])
  }

  /**
   * Get contract approve call method
   *
   * @param contractAddress
   * @param spenderAddress
   * @param value
   */
  getApproveCall(
    contractAddress: string,
    spenderAddress: string,
    value: string
  ): string {
    return this.callContractMethod('Approve', contractAddress, [
      spenderAddress,
      Utils.isHexStrict(value) ? value : Utils.numberToHex(value)
    ])
  }

  /**
   * Get contract total supply
   *
   * @param contractAddress
   * @param cb
   */
  getTotalSupply(contractAddress: string, cb: Callback): void {
    this.getContractInfo(
      {
        action: 'TotalSupply',
        contractAddress
      },
      (err, res) => {
        cb(err, Utils.hexToNumberString(res))
      }
    )
  }

  /**
   * Get contract name
   *
   * @param contractAddress
   * @param cb
   */
  getContractName(contractAddress: string, cb: Callback): void {
    this.getContractInfo(
      {
        action: 'Name',
        contractAddress
      },
      (err, res) => {
        cb(err, res)
      }
    )
  }

  /**
   * Get contract symbol
   *
   * @param contractAddress
   * @param cb
   */
  getContractSymbol(contractAddress: string, cb: Callback): void {
    this.getContractInfo(
      {
        action: 'Symbol',
        contractAddress
      },
      (err, res) => {
        cb(err, res)
      }
    )
  }

  /**
   * Get contract decimals
   *
   * @param contractAddress
   * @param cb
   */
  getContractDecimals(contractAddress: string, cb: Callback): void {
    this.getContractInfo(
      {
        action: 'Decimals',
        contractAddress
      },
      (err, res) => {
        cb(err, res)
      }
    )
  }

  /**
   * Get contract balance by address
   *
   * @param contractAddress
   * @param address
   * @param cb
   */
  getContractBalanceByAddress(
    contractAddress: string,
    address: string,
    cb: Callback
  ): void {
    this.getContractInfo(
      {
        action: 'BalanceOf',
        contractAddress,
        params: [address]
      },
      (err, res) => {
        cb(err, Utils.hexToNumberString(res))
      }
    )
  }

  /**
   * Get contract allowance
   *
   * @param contractAddress
   * @param ownerAddress
   * @param spenderAddress
   * @param cb
   */
  getContractAllowance(
    contractAddress: string,
    ownerAddress: string,
    spenderAddress: string,
    cb: Callback
  ): void {
    this.getContractInfo(
      {
        action: 'Allowance',
        contractAddress,
        params: [ownerAddress, spenderAddress]
      },
      (err, res) => {
        cb(err, Utils.hexToNumberString(res))
      }
    )
  }

  /**
   * Get contract detail
   */
  getContractDetail: (
    address: string,
    cb?: Callback
  ) => Promise<
    ReturnType<typeof Helper.Formatters.outputContractDetailFormatter>
  > = this.buildCall({
    call: 'chainstack_getContract',
    name: 'getContractDetail',
    outputFormatter: Helper.Formatters.outputContractDetailFormatter,
    params: 1
  })

  static checkContractOptions(
    options: ContractOptions,
    contractType: string
  ): void {
    let isValid = true

    if (contractType !== CONTRACT_TYPE_ERC20) {
      isValid = false
    }

    if (!Utils.isAddress(options.owner)) {
      isValid = false
    }

    if (!options.tokenName) {
      isValid = false
    }

    if (!options.tokenDecimals || options.tokenDecimals < 0) {
      isValid = false
    }

    if (!options.tokenSymbol) {
      isValid = false
    }

    if (!options.tokenTotalSupply) {
      isValid = false
    }

    if (!isValid) {
      throw new Helper.Errors.InvalidContractOptionsError()
    }
  }

  private callContractMethod = (
    action: string,
    contractAddress: string,
    params: any[]
  ): string => {
    return JSON.stringify({
      action,
      contract_address: contractAddress,
      params: JSON.stringify(params)
    })
  }

  private getContractInfo: (
    param: {
      action: string
      contractAddress: string
      params?: any[]
    },
    cb: Callback
  ) => Promise<any> = this.buildCall({
    call: 'chainstack_getContractInfo',
    name: 'getContractInfo',
    inputFormatter: [Helper.Formatters.inputContractCallFormatter],
    params: 1
  })
}

interface ContractResult {
  contractData: string
  contractAddress: string
}

interface ContractData {
  action: string
  contract_address: string
  params: string
}

interface ContractParams {
  owner: string
  token_name: string
  token_decimals: number
  token_symbol: string
  token_total_supply: string
  balances: object
  allowed: object
}

interface ContractOptions {
  owner: string
  tokenName: string
  tokenDecimals: number
  tokenSymbol: string
  tokenTotalSupply: string
  balances?: object
  allowed?: object
}

export default Contract
