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
      '0xe1df0a960000000000000000000000012132143242353453453480808227100a8001'
    )

    expect(
      transaction.rlpTx({
        txData: txData2,
        chainId: '0x03'
      })
    ).toEqual(
      '0xf85af857019600014059a38f1e42bd9a415f4578cd6f347112951d8da064e604787cbf194841e7b68d7cd28786f6c9a0a3ab9f8b0a0e87cb4387ab010782870482271064960000970e8128ab834e8eac17ab8e3812f010678cf79103'
    )
  })

  it('hashRlpTx', () => {
    expect(
      transaction.hashRlpTx({
        txData: txData1,
        chainId: '0x01'
      })
    ).toEqual(
      '0x69196b681582f4a42bfb9445e9c10889ed7662695b177483752abb7d4c0f193e'
    )

    expect(
      transaction.hashRlpTx({
        txData: txData2,
        chainId: '0x03'
      })
    ).toEqual(
      '0x2b292e16e6e1e648bb39c1d31fd6a0b2b0b67ee36d2b7ba2ad9231f5a657e5e9'
    )
  })

  it('signTransaction', () => {
    expect(transaction.signTransaction(txData1, pk1, '0x01')).toEqual([
      '0x38',
      '0xf1bd5e6ffe6d3d1b78f7dc58a5e922229a5eba863e8d2dfa8e2e4df52837d2e4',
      '0x245a507467fb8e02001e61bb888b713c9cff16d3f2b798d62f5228f58eef961e'
    ])
    expect(transaction.signTransaction(txData2, pk2, '0x03')).toEqual([
      '0x3c',
      '0x1c2b9a65ba8bb0d5bd7b07655a909ecd2b17ff6c1a88c0a25051d155219457bf',
      '0x5cbbc90b74bb7e0a3f6d80df57674fb60d4a6325a30fb031ab33f03f463fa3a9'
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
      '0xc79058dc06cd38f6941f77d031f99f788ebc2e856a43755a4d8f18ca5156c4c8'
    )
  })
})
