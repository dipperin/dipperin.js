import Contract from './index'
import Helper from '../../helper'
import Provider from '../../providers/httpProvider'
const provider = new Provider('http://localhost:8888')

// TODO
// test('Contract/createContactCallTransaction', () => {
//   const contract = new Contract(provider)

//   const transactionData = {
//     nonce: '0x0a',
//     to: '0x00000000000000000000000121321432423534534534',
//     hashLock: null,
//     timeLock: 0,
//     value: '10000',
//     fee: '10',
//     extraData: 'sss'
//   }

//   const privateKey =
//     '0x289c2857d4598e37fb9647507e47a309d6133539bf21a8b9cb6df88fd5232032'

//   const signedTx = contract.createContactCallTransaction(
//     transactionData,
//     privateKey
//   )
//   expect(signedTx.tx.txData).toEqual(transactionData)
// })

test('Contract/getTransferCall', () => {
  const contract = new Contract(provider)
  // const options = {
  //     owner: 'o',
  //     tokenName: '1',
  //     tokenDecimals: 1,
  //     tokenSymbol: '1',
  //     tokenTotalSupply: '1',
  // }
  expect(contract.getTransferCall('contact', 'aa', '0xc1912')).toEqual(
    JSON.stringify({
      action: 'Transfer',
      contract_address: 'contact',
      params: JSON.stringify(['aa', '0xc1912'])
    })
  )
})

test('Contract/getTransferFromCall', () => {
  const contract = new Contract(provider)
  const contractAddress = 'address'
  const from = 'from'
  const to = 'to'
  const value = '123'
  expect(contract.getTransferFromCall(contractAddress, from, to, value)).toBe(
    JSON.stringify({
      action: 'TransferFrom',
      contract_address: contractAddress,
      params: JSON.stringify([from, to, `0x${Number(value).toString(16)}`])
    })
  )
})

test('Contract/getApproveCall', () => {
  const contractAddress = 'contractAddress'
  const spenderAddress = 'spenderAddress'
  const value = '12412'
  const contract = new Contract(provider)
  expect(contract.getApproveCall(contractAddress, spenderAddress, value)).toBe(
    JSON.stringify({
      action: 'Approve',
      contract_address: contractAddress,
      params: JSON.stringify([
        spenderAddress,
        `0x${Number(value).toString(16)}`
      ])
    })
  )
})

test('Contract/createContract', () => {
  const options = {
    owner: '0x00009328d55ccb3fce531f199382339f0e576ee840b2',
    tokenName: '1',
    tokenDecimals: 1,
    tokenSymbol: '1',
    tokenTotalSupply: '1'
  }
  // expect(Contract.createContract(options,'ERC20')).toEqual({
  //     contractAddress: options.owner,
  //     contractData: {
  //         action: 'create',
  //         ccontract_address: Account.genContractAddress()
  //     }
  // })
  expect(
    JSON.parse(Contract.createContract(options, 'ERC20').contractData).params
  ).toBe(
    JSON.stringify({
      owner: options.owner,
      token_name: '1',
      token_decimals: 1,
      token_symbol: '1',
      token_total_supply: '0x1',
      balances: {
        [options.owner]: '0x1'
      },
      allowed: {}
    })
  )
})

// TODO
// test('contract/createDeployContractTransaction', () => {
//   const nonce = '1001'
//   const value = '12000000'
//   const chainId = '0x01'
//   const fee = '1000'
//   const hashLock = '0x00009328d55ccb3fce531f199382339f0e576ee840b1'
//   const to = '0x00009328d55ccb3fce531f199382339f0e576ee840b1'
//   const contractData = 'sss'
//   const timeLock = 12

//   const privateKey =
//     '0x289c2857d4598e37fb9647507e47a309d6133539bf21a8b9cb6df88fd5232032'

//   expect(
//     Contract.createDeployContractTransaction(
//       {
//         nonce,
//         value,
//         fee,
//         hashLock,
//         to,
//         extraData: contractData,
//         timeLock
//       },

//       privateKey,
//       chainId
//     ).tx.txData.nonce
//   ).toBe(nonce)

//   expect(
//     Contract.createDeployContractTransaction(
//       {
//         nonce,
//         value,
//         fee,
//         hashLock,
//         to,
//         extraData: contractData,
//         timeLock
//       },
//       privateKey,
//       chainId
//     ).tx.txData.fee
//   ).toBe(fee)

//   expect(
//     Contract.createDeployContractTransaction(
//       {
//         nonce,
//         value,
//         fee,
//         hashLock,
//         to,
//         extraData: contractData,
//         timeLock
//       },

//       privateKey,
//       chainId
//     ).tx.txData.to
//   ).toBe(to)
// })

test('contract/checkContractOptions', () => {
  const options = {
    owner: '0x00009328d55ccb3fce531f199382339f0e576ee840b2',
    tokenName: '1',
    tokenDecimals: 1,
    tokenSymbol: '1',
    tokenTotalSupply: '1'
  }
  expect(() => {
    Contract.checkContractOptions(options, 'ERC20')
  }).not.toThrow()
  expect(() => {
    Contract.checkContractOptions(options, 'ERC2')
  }).toThrowError(Helper.Errors.InvalidContractOptionsError)
  const options1 = {
    owner: 'test',
    tokenName: '1',
    tokenDecimals: 1,
    tokenSymbol: '1',
    tokenTotalSupply: '1'
  }
  expect(() => {
    Contract.checkContractOptions(options1, 'ERC20')
  }).toThrowError()
  const options2 = {
    owner: '0x00009328d55ccb3fce531f199382339f0e576ee840b2',
    tokenName: '',
    tokenDecimals: 1,
    tokenSymbol: '1',
    tokenTotalSupply: '1'
  }
  expect(() => {
    Contract.checkContractOptions(options2, 'ERC20')
  }).toThrowError()
  const options3 = {
    owner: '0x00009328d55ccb3fce531f199382339f0e576ee840b2',
    tokenName: 'name',
    tokenDecimals: -1,
    tokenSymbol: '1',
    tokenTotalSupply: '1'
  }
  expect(() => {
    Contract.checkContractOptions(options3, 'ERC20')
  }).toThrowError()
  const options4 = {
    owner: '0x00009328d55ccb3fce531f199382339f0e576ee840b2',
    tokenName: 'name',
    tokenDecimals: 1,
    tokenSymbol: '',
    tokenTotalSupply: '1'
  }
  expect(() => {
    Contract.checkContractOptions(options4, 'ERC20')
  }).toThrowError()
  const options5 = {
    owner: '0x00009328d55ccb3fce531f199382339f0e576ee840b2',
    tokenName: 'name',
    tokenDecimals: 1,
    tokenSymbol: '1',
    tokenTotalSupply: ''
  }
  expect(() => {
    Contract.checkContractOptions(options5, 'ERC20')
  }).toThrowError()
})
