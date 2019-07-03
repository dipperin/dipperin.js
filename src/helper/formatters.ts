import Helper from '../helper'
import Utils from '../utils'

export const inputContractCallFormatter = (options: {
  action: string
  contractAddress: string
  params: any[]
}) => {
  return {
    action: options.action,
    contract_address: options.contractAddress,
    params: JSON.stringify(options.params || [])
  }
}

export const inputAddressFormatter = (address: string): string => {
  if (Utils.isAddress(address)) {
    if (address.includes('0x')) {
      return address
    } else {
      return `0x${address}`
    }
  } else {
    throw new Helper.Errors.InvalidAddressError(address)
  }
}

export const inputAddressesFormatter = (addresses: string[]): string[] => {
  return addresses.map(address => {
    return inputAddressFormatter(address)
  })
}

export const inputHashFormatter = (hash: string): number[] => {
  return Array.prototype.slice.call(Buffer.from(hash.replace('0x', ''), 'hex'))
}

export const inputPlaceholderFormatter = <T>(arg: T): T => {
  if (arg) {
    return arg
  } else {
    return undefined
  }
}

export const outputBalanceFormatter = (output): string => {
  return Utils.hexToNumberString(output.balance)
}

export const outputLockMoneyFormatter = (output): string => {
  return Utils.hexToNumberString(output)
}

export const outputNonceFormatter = (output): string =>
  Utils.hexToNumberString(output)

export const outputContractDetailFormatter = (output): ContractOutput => {
  const formatOutput: ContractOutput = {
    tokenName: output.token_name,
    tokenDecimals: output.token_decimals,
    tokenSymbol: output.token_symbol,
    tokenTotalSupply: Utils.hexToNumberString(output.token_total_supply),
    balances: {},
    allowed: {},
    owner: output.owner
  }

  Object.keys(output.balances).forEach(address => {
    formatOutput.balances[address] = Utils.hexToNumberString(
      output.balances[address]
    )
  })

  return formatOutput
}

export interface AccountBalanceOutput {
  balance: string
  nonce: string
}

export interface ContractOutput {
  tokenName: string
  tokenDecimals: number
  tokenSymbol: string
  tokenTotalSupply: string
  balances: object
  allowed: object
  owner: string
}

export default {
  inputAddressFormatter,
  inputAddressesFormatter,
  inputHashFormatter,
  inputPlaceholderFormatter,
  inputContractCallFormatter,
  outputBalanceFormatter,
  outputLockMoneyFormatter,
  outputNonceFormatter,
  outputContractDetailFormatter
}
