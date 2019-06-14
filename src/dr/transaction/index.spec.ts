import Transaction from './index'
import Helper from '../../helper'

const pk1 = '0x289c2857d4598e37fb9647507e47a309d6133539bf21a8b9cb6df88fd5232031'
const pk2 = '0x289c2857d4598e37fb9647507e47a309d6133539bf21a8b9cb6df88fd5232032'

const transactionResult = {
  txData: {
    nonce: '0x0a',
    to: '0x00000000000000000000000121321432423534534534',
    hashLock: null,
    timeLock: 0,
    value: '10000',
    fee: '10',
    extraData: ''
  },
  witness: {
    r: '0xf1bd5e6ffe6d3d1b78f7dc58a5e922229a5eba863e8d2dfa8e2e4df52837d2e4',
    s: '0x245a507467fb8e02001e61bb888b713c9cff16d3f2b798d62f5228f58eef961e',
    v: '0x38',
    hashKey: '0x'
  }
}

const transactionResult2 = {
  txData: {
    nonce: '0x1',
    to: '0x00014059a38f1e42bd9a415f4578cd6f347112951d8d',
    hashLock:
      '0x64e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107',
    timeLock: 34564,
    value: '10000',
    fee: '100',
    extraData: '0x0000970e8128ab834e8eac17ab8e3812f010678cf791'
  },
  witness: {
    r: '0x1c2b9a65ba8bb0d5bd7b07655a909ecd2b17ff6c1a88c0a25051d155219457bf',
    s: '0x5cbbc90b74bb7e0a3f6d80df57674fb60d4a6325a30fb031ab33f03f463fa3a9',
    v: '0x3c',
    hashKey: '0x'
  }
}

// pk 0xcb0360d1678e7fdcb04e1347ab4f1d06fe2fac353ad41a60c4a552496296f9ae
const transactionResult3 = {
  txData: {
    nonce: '20',
    to: '0x00001B0e12d3b39F606f2B83d5c78d2C3A41A9CC91CF',
    hashLock: '0x',
    timeLock: 0,
    value: '2400000000',
    fee: '11300',
    extraData: ''
    // from: '0x0000b4293d60f051936bedecfae1b85d5a46d377af37'
  },
  witness: {
    r: '0xf38ee355b1d6ba0b31460f1855e3d23d83c0b67d6f160bc0d76bcd5a6f409a16',
    s: '0x009b7959883631476114a680a6eafc8bcff53bc66a9d1a75b2b34aff2ba8efa5',
    v: '0x39',
    hashKey: '0x'
  }
}

describe('cs/transaction', () => {
  it('serialize', () => {
    const tx = new Transaction(transactionResult)
    tx.sign(pk1)
    expect(tx.serialize()).toBe(
      '0xf868e10a960000000000000000000000012132143242353453453480808227100a808080f844a076c8923c4dfba0a112c7a0db4cb5808a9acb60f4165727d0dcf607793178bb37a00895879ed65610cb24db50bd727096c59e9abea2b60b5d747fadf4124c334cd93880'
    )
    const tx2 = new Transaction(transactionResult2)
    tx2.sign(pk2, '0x03')
    expect(tx2.serialize()).toBe(
      '0xf8a1f859019600014059a38f1e42bd9a415f4578cd6f347112951d8da064e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107828704822710648080960000970e8128ab834e8eac17ab8e3812f010678cf791f844a0ea8f6fa248bc6a6a64d5005dec4150b11c73bec61c5c61cb02f758baa58bd747a05755f396af9a7d3594cf72e88b9cb20f1ee4b300d22354b5090d9fcb1681aa113c80'
    )

    const tx3 = new Transaction(transactionResult3)
    tx3.sign(
      '0xcb0360d1678e7fdcb04e1347ab4f1d06fe2fac353ad41a60c4a552496296f9ae'
    )

    expect(tx3.serialize()).toBe(
      '0xf86ce5149600001B0e12d3b39F606f2B83d5c78d2C3A41A9CC91CF8080848f0d1800822c24808080f844a0bcb37de93b57a49961a2808778e86eac8e34c85b1f47659d7e26519aebe9ed67a02f760cdc7559e4a6e6e986ca48b3f30f856d983314f62a406a5583124b99e9f93980'
    )
  })
  it('unserialize', () => {
    const unSerializeTx = Transaction.unserialize(
      '0xf868e10a960000000000000000000000012132143242353453453480808227100a808080f844a076c8923c4dfba0a112c7a0db4cb5808a9acb60f4165727d0dcf607793178bb37a00895879ed65610cb24db50bd727096c59e9abea2b60b5d747fadf4124c334cd93880'
    )
    expect(unSerializeTx.transactionResult.txData.value).toEqual('10000')
    expect(unSerializeTx.transactionResult.txData.extraData).toEqual('')
    expect(unSerializeTx.transactionResult.txData.fee).toEqual('10')
    expect(unSerializeTx.transactionResult.txData.hashLock).toEqual('0x')
    expect(unSerializeTx.transactionResult.txData.nonce).toEqual('10')
    expect(unSerializeTx.transactionResult.txData.timeLock).toEqual(0)
    expect(unSerializeTx.transactionResult.txData.to).toEqual(
      '0x00000000000000000000000121321432423534534534'
    )

    const unSerializeTx2 = Transaction.unserialize(
      '0xf8a1f859019600014059a38f1e42bd9a415f4578cd6f347112951d8da064e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107828704822710648080960000970e8128ab834e8eac17ab8e3812f010678cf791f844a0ea8f6fa248bc6a6a64d5005dec4150b11c73bec61c5c61cb02f758baa58bd747a05755f396af9a7d3594cf72e88b9cb20f1ee4b300d22354b5090d9fcb1681aa113c80'
    )
    expect(unSerializeTx2.transactionResult.txData.value).toEqual('10000')
    expect(unSerializeTx2.transactionResult.txData.extraData).toEqual(
      '0x0000970e8128ab834e8eac17ab8e3812f010678cf791'
    )
    expect(unSerializeTx2.transactionResult.txData.fee).toEqual('100')
    expect(unSerializeTx2.transactionResult.txData.hashLock).toEqual(
      '0x64e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107'
    )
    expect(unSerializeTx2.transactionResult.txData.nonce).toEqual('1')
    expect(unSerializeTx2.transactionResult.txData.timeLock).toEqual(34564)
    expect(unSerializeTx2.transactionResult.txData.to).toEqual(
      '0x00014059a38f1e42bd9a415f4578cd6f347112951d8d'
    )

    // const unSerializeTx3 = Transaction.unserialize(
    //   "0xf86ae3149600001B0e12d3b39F606f2B83d5c78d2C3A41A9CC91CF8080848f0d1800822c2480f844a0f38ee355b1d6ba0b31460f1855e3d23d83c0b67d6f160bc0d76bcd5a6f409a16a0009b7959883631476114a680a6eafc8bcff53bc66a9d1a75b2b34aff2ba8efa53980"
    // )
    // console.log(unSerializeTx3)
  })

  // f869e31496
  // 00001b0e12d3b39f606f2b83d5c78d2c3a41a9cc91cf
  // 80
  // 80
  // 84 8f0d1800
  // 82 2c24
  // 80
  // f843a0
  // f38ee355b1d6ba0b31460f1855e3d23d83c0b67d6f160bc0d76bcd5a6f409a16
  // 9f
  // 9b7959883631476114a680a6eafc8bcff53bc66a9d1a75b2b34aff2ba8efa539
  // 80
  // f86ae31496
  // 00001B0e12d3b39F606f2B83d5c78d2C3A41A9CC91CF
  // 80
  // 80
  // 84 8f0d1800
  // 822c24
  // 80
  // f844a0
  // f38ee355b1d6ba0b31460f1855e3d23d83c0b67d6f160bc0d76bcd5a6f409a16
  // a0
  // 009b7959883631476114a680a6eafc8bcff53bc66a9d1a75b2b34aff2ba8efa5
  // 39
  // 80

  it('recover', () => {
    const unSerializeTx = Transaction.unserialize(
      '0xf868e10a960000000000000000000000012132143242353453453480808227100a808080f844a076c8923c4dfba0a112c7a0db4cb5808a9acb60f4165727d0dcf607793178bb37a00895879ed65610cb24db50bd727096c59e9abea2b60b5d747fadf4124c334cd93880'
    )
    expect(unSerializeTx.recover()).toEqual(Helper.Account.fromPrivate(pk1))

    const unSerializeTx2 = Transaction.unserialize(
      '0xf8a1f859019600014059a38f1e42bd9a415f4578cd6f347112951d8da064e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab0107828704822710648080960000970e8128ab834e8eac17ab8e3812f010678cf791f844a0ea8f6fa248bc6a6a64d5005dec4150b11c73bec61c5c61cb02f758baa58bd747a05755f396af9a7d3594cf72e88b9cb20f1ee4b300d22354b5090d9fcb1681aa113c80'
    )
    expect(unSerializeTx2.recover()).toEqual(Helper.Account.fromPrivate(pk2))
  })

  // it('getfee', () => {
  //   const transactionResult2 = {
  //     txData: {
  //       nonce: '0x1',
  //       to: '0x00014059a38f1e42bd9a415f4578cd6f347112951d8d',
  //       hashLock:
  //         '',
  //       timeLock: 0,
  //       value: '100000000',
  //       fee: '1',
  //       extraData: ''
  //     }
  //   }
  //   const tx = new Transaction(transactionResult2)
  //   // expect(tx.getFee()).toBe('')
  //   tx.sign(pk1)
  //   expect(tx.getFee()).toBe('')
  //   /** unsign / signed */
  //   // 80 145
  //   // 104 169
  //   // 72 137
  //   // 70 135
  //   // 40 106
  //   /** fee / length */
  //   // 0 10600
  //   // 10 10600
  //   // 100 10600
  //   // 1000 10800
  //   // 10000 10800
  //   // 100000 10900

  // })
})
