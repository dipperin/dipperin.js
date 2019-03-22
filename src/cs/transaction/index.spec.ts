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

describe('cs/transaction', () => {
  it('serialize', () => {
    const tx = new Transaction(transactionResult)
    tx.sign(pk1)
    expect(tx.serialize()).toBe(
      '0xf866df0a960000000000000000000000012132143242353453453480808227100a80f844a0f1bd5e6ffe6d3d1b78f7dc58a5e922229a5eba863e8d2dfa8e2e4df52837d2e4a0245a507467fb8e02001e61bb888b713c9cff16d3f2b798d62f5228f58eef961e3880'
    )
    const tx2 = new Transaction(transactionResult2)
    tx2.sign(pk2, '0x03')
    expect(tx2.serialize()).toBe(
      '0xf89ff857019600014059a38f1e42bd9a415f4578cd6f347112951d8da064e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab010782870482271064960000970e8128ab834e8eac17ab8e3812f010678cf791f844a01c2b9a65ba8bb0d5bd7b07655a909ecd2b17ff6c1a88c0a25051d155219457bfa05cbbc90b74bb7e0a3f6d80df57674fb60d4a6325a30fb031ab33f03f463fa3a93c80'
    )
  })
  it('unserialize', () => {
    const unSerializeTx = Transaction.unserialize(
      '0xf866df0a960000000000000000000000012132143242353453453480808227100a80f844a0f1bd5e6ffe6d3d1b78f7dc58a5e922229a5eba863e8d2dfa8e2e4df52837d2e4a0245a507467fb8e02001e61bb888b713c9cff16d3f2b798d62f5228f58eef961e3880'
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
      '0xf89ff857019600014059a38f1e42bd9a415f4578cd6f347112951d8da064e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab010782870482271064960000970e8128ab834e8eac17ab8e3812f010678cf791f844a01c2b9a65ba8bb0d5bd7b07655a909ecd2b17ff6c1a88c0a25051d155219457bfa05cbbc90b74bb7e0a3f6d80df57674fb60d4a6325a30fb031ab33f03f463fa3a93c80'
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
  })
  // TODO
  // it('getTxHash', () => {
  //   const tx = new Transaction(transactionResult)
  //   tx.sign(pk1)
  //   expect(tx.getTxHash()).toBe(
  //     '0x528131488f97c6314b2fa0dff404f1037067e787b65cb244d79c7ecea007c0d5'
  //   )
  //   const tx2 = new Transaction(transactionResult2)
  //   tx2.sign(pk2, '0x03')
  //   expect(tx2.getTxHash()).toBe(
  //     '0x0aedd7a6779339cc44fe1e51cdf42b4bf3a557d52e646390e6d6bf6d489a5de3'
  //   )
  // })

  it('recover', () => {
    const unSerializeTx = Transaction.unserialize(
      '0xf866df0a960000000000000000000000012132143242353453453480808227100a80f844a0f1bd5e6ffe6d3d1b78f7dc58a5e922229a5eba863e8d2dfa8e2e4df52837d2e4a0245a507467fb8e02001e61bb888b713c9cff16d3f2b798d62f5228f58eef961e3880'
    )
    expect(unSerializeTx.recover()).toEqual(Helper.Account.fromPrivate(pk1))

    const unSerializeTx2 = Transaction.unserialize(
      '0xf89ff857019600014059a38f1e42bd9a415f4578cd6f347112951d8da064e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab010782870482271064960000970e8128ab834e8eac17ab8e3812f010678cf791f844a01c2b9a65ba8bb0d5bd7b07655a909ecd2b17ff6c1a88c0a25051d155219457bfa05cbbc90b74bb7e0a3f6d80df57674fb60d4a6325a30fb031ab33f03f463fa3a93c80'
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
