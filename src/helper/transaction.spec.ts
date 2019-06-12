import transaction from './transaction'

const pk1 = '0x289c2857d4598e37fb9647507e47a309d6133539bf21a8b9cb6df88fd5232031'
const pk2 = '0x289c2857d4598e37fb9647507e47a309d6133539bf21a8b9cb6df88fd5232032'

describe('helper/transaction', () => {
  const txData1 = {
    nonce: '0x0a',
    to: '0x00000000000000000000000121321432423534534534',
    hashLock: null,
    timeLock: 0,
    value: '10000',
    fee: '10',
    extraData: ''
  }
  const txData2 = {
    nonce: '0x1',
    to: '0x00014059a38f1e42bd9a415f4578cd6f347112951d8d',
    hashLock:
      '0x64e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107',
    timeLock: 34564,
    value: '10000',
    fee: '100',
    extraData: '0x0000970e8128ab834e8eac17ab8e3812f010678cf791'
  }

  it('rlpTx', () => {
    expect(
      transaction.rlpTx({
        txData: txData1,
        chainId: '0x01'
      })
    ).toEqual(
      '0xe3e10a960000000000000000000000012132143242353453453480808227100a80808001'
    )

    expect(
      transaction.rlpTx({
        txData: txData2,
        chainId: '0x03'
      })
    ).toEqual(
      '0xf85cf859019600014059a38f1e42bd9a415f4578cd6f347112951d8da064e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107828704822710648080960000970e8128ab834e8eac17ab8e3812f010678cf79103'
    )
  })

  it('hashRlpTx', () => {
    expect(
      transaction.hashRlpTx({
        txData: txData1,
        chainId: '0x01'
      })
    ).toEqual(
      '0x40d02d17c38fa19dfb99aafbc41ae25307a5dfe6bcadad4760fcbdc275cdaf93'
    )

    expect(
      transaction.hashRlpTx({
        txData: txData2,
        chainId: '0x03'
      })
    ).toEqual(
      '0x38eeddf05db494f2b998330d7f0c461a8431bb8f5fb0adc8d4e9b611f8f44791'
    )
  })

  it('signTransaction', () => {
    expect(transaction.signTransaction(txData1, pk1, '0x01')).toEqual([
      '0x38',
      '0x76c8923c4dfba0a112c7a0db4cb5808a9acb60f4165727d0dcf607793178bb37',
      '0x0895879ed65610cb24db50bd727096c59e9abea2b60b5d747fadf4124c334cd9'
    ])
    expect(transaction.signTransaction(txData2, pk2, '0x03')).toEqual([
      '0x3c',
      '0xea8f6fa248bc6a6a64d5005dec4150b11c73bec61c5c61cb02f758baa58bd747',
      '0x5755f396af9a7d3594cf72e88b9cb20f1ee4b300d22354b5090d9fcb1681aa11'
    ])
  })

  it('getTransactionId', () => {
    const data = {
      extraData: '',
      fee: '100000000',
      from: '0x0000d28Eb0154A96F4af6E631766939593554c7E5577',
      hashLock: '',
      nonce: '4',
      timeLock: 0,
      to: '0x0000E21391AA1ccAcb7c8E7E2E645Bb2cF811fe1E30D',
      value: '100000000000000'
    }
    expect(transaction.getTransactionId(data)).toBe(
      '0x076f135dd359ecac58c5314942385520a6736eba95338517f9c1a9a4d1bb13c3'
    )
  })
})
