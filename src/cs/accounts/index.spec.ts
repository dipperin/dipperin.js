import { has } from 'lodash'
import Helper from '../../helper'
import Utils from '../../utils'
import Accounts from './index'

test('cs/accounts/create/null', () => {
  const acc = Accounts.create()
  expect(acc.address).toBe(Helper.Account.fromPrivate(acc.privateKey))
  expect(has(acc, 'signTransaction')).toBeTruthy()
  expect(has(acc, 'sign')).toBeTruthy()
  expect(has(acc, 'encrypt')).toBeTruthy()
})

test('cs/accounts/create/seed', () => {
  const acc = Accounts.create(
    '0x1457fff042637cf08e36424a1ebcc8a185bb7a9b02e7899666ff3829fbea16f79d1156aea347e8ed9695d1f64c04ea30b1faf5cda9b27eb2bf3db7dca94fe318'
  )
  expect(acc.address).toBe('0x000000dC5e092923B7A23550AA653852068981bb9337')
})

test('cs/accounts/create/extended private key', () => {
  const acc = Accounts.create(
    'xprv9s21ZrQH143K2sxdCz2FUoSxqLYFYgNdxJdAktoTTECFtw9dSWv4Ca6pnbPSBd73sHuoPpWzVsuArufozcAA9b9FNXXq1fWjwU7bQESwGhP'
  )
  expect(acc.address).toBe('0x000000dC5e092923B7A23550AA653852068981bb9337')
})

test('cs/accounts/create/extended public key', () => {
  const acc = Accounts.create(
    'xpub661MyMwAqRbcFN36K1ZFqwPhPNNjx96VKXYmZHD51ZjEmjUmz4EJkNRJdsncgGgdopdGHW1tto6iQF5JWRQcJxCW7PC49x7hp8Ko5s6F7HR'
  )
  expect(acc.address).toBe('0x000000dC5e092923B7A23550AA653852068981bb9337')
})

test('cs/accounts/fromSeed', () => {
  const acc = Accounts.fromSeed(
    '0x1457fff042637cf08e36424a1ebcc8a185bb7a9b02e7899666ff3829fbea16f79d1156aea347e8ed9695d1f64c04ea30b1faf5cda9b27eb2bf3db7dca94fe318'
  )

  expect(acc.seed).toBe(
    '0x1457fff042637cf08e36424a1ebcc8a185bb7a9b02e7899666ff3829fbea16f79d1156aea347e8ed9695d1f64c04ea30b1faf5cda9b27eb2bf3db7dca94fe318'
  )
  expect(acc.privateExtendedKey).toBe(
    'xprv9s21ZrQH143K2sxdCz2FUoSxqLYFYgNdxJdAktoTTECFtw9dSWv4Ca6pnbPSBd73sHuoPpWzVsuArufozcAA9b9FNXXq1fWjwU7bQESwGhP'
  )
  expect(acc.publicExtendedKey).toBe(
    'xpub661MyMwAqRbcFN36K1ZFqwPhPNNjx96VKXYmZHD51ZjEmjUmz4EJkNRJdsncgGgdopdGHW1tto6iQF5JWRQcJxCW7PC49x7hp8Ko5s6F7HR'
  )
  expect(acc.privateKey).toBe(
    '0x083abc052e02f48b5305d05adc9ae3525217700639a3f4c6972b4cda9f497a6c'
  )
  expect(acc.publicKey).toBe(
    '0x02bc8cd9907d5fd7aa9c398d5fdd7203c651026ea26961679ff8ebc3dab4f5aa2e'
  )
  expect(acc.address).toBe('0x000000dC5e092923B7A23550AA653852068981bb9337')
})

test('cs/accounts/fromExtendedKey - private', () => {
  const acc = Accounts.fromExtendedKey(
    'xprv9s21ZrQH143K2sxdCz2FUoSxqLYFYgNdxJdAktoTTECFtw9dSWv4Ca6pnbPSBd73sHuoPpWzVsuArufozcAA9b9FNXXq1fWjwU7bQESwGhP'
  )

  expect(acc.seed).toBe(null)
  expect(acc.privateExtendedKey).toBe(
    'xprv9s21ZrQH143K2sxdCz2FUoSxqLYFYgNdxJdAktoTTECFtw9dSWv4Ca6pnbPSBd73sHuoPpWzVsuArufozcAA9b9FNXXq1fWjwU7bQESwGhP'
  )
  expect(acc.publicExtendedKey).toBe(
    'xpub661MyMwAqRbcFN36K1ZFqwPhPNNjx96VKXYmZHD51ZjEmjUmz4EJkNRJdsncgGgdopdGHW1tto6iQF5JWRQcJxCW7PC49x7hp8Ko5s6F7HR'
  )
  expect(acc.privateKey).toBe(
    '0x083abc052e02f48b5305d05adc9ae3525217700639a3f4c6972b4cda9f497a6c'
  )
  expect(acc.publicKey).toBe(
    '0x02bc8cd9907d5fd7aa9c398d5fdd7203c651026ea26961679ff8ebc3dab4f5aa2e'
  )
  expect(acc.address).toBe('0x000000dC5e092923B7A23550AA653852068981bb9337')
})

test('cs/accounts/fromExtendedKey - public', () => {
  const acc = Accounts.fromExtendedKey(
    'xpub661MyMwAqRbcFN36K1ZFqwPhPNNjx96VKXYmZHD51ZjEmjUmz4EJkNRJdsncgGgdopdGHW1tto6iQF5JWRQcJxCW7PC49x7hp8Ko5s6F7HR'
  )

  expect(acc.seed).toBe(null)
  expect(acc.privateExtendedKey).toBe(null)
  expect(acc.publicExtendedKey).toBe(
    'xpub661MyMwAqRbcFN36K1ZFqwPhPNNjx96VKXYmZHD51ZjEmjUmz4EJkNRJdsncgGgdopdGHW1tto6iQF5JWRQcJxCW7PC49x7hp8Ko5s6F7HR'
  )
  expect(acc.privateKey).toBe(null)
  expect(acc.publicKey).toBe(
    '0x02bc8cd9907d5fd7aa9c398d5fdd7203c651026ea26961679ff8ebc3dab4f5aa2e'
  )
  expect(acc.address).toBe('0x000000dC5e092923B7A23550AA653852068981bb9337')
})

const testData = [
  {
    address: '0x0000eb014f8c8b418DB6B45774C326A0e64C78914dc0',
    data: 'Some data',
    hash: '0x3b9d51379da4f56cb55ca3e7f7ca92c8798b1d25abe0d6a6abab50b135e7794e',
    privateKey:
      '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
    r: '0x123476d36992bdef82362488eb00a154b52284cc0ccec330227f6d3b2b8d763d',
    s: '0x6d9e18d574a01d519024b91e4193d43fd94e806bc6b0c35941e36dd0a79f0b97',
    signature:
      '0x123476d36992bdef82362488eb00a154b52284cc0ccec330227f6d3b2b8d763d6d9e18d574a01d519024b91e4193d43fd94e806bc6b0c35941e36dd0a79f0b971',
    v: '0x1'
  },
  {
    address: '0x0000eb014f8c8b418DB6B45774C326A0e64C78914dc0',
    data: 'Some data!%$$%&@*',
    hash: '0x27e5ac66bbdd0cf0e1c79b01d8c9fa922f231be88571a1f0daf1368e29e4c8f4',
    privateKey:
      '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
    r: '0x1c5b5023cb202ce23deb6af76643b649bd925b8c01f5bcd77cfd3ac64a42e255',
    s: '0x1cc30ae3e43a43bf5007b072bea2382dddcb6c42ff9148167e4dbdf98d81705d',
    signature:
      '0x1c5b5023cb202ce23deb6af76643b649bd925b8c01f5bcd77cfd3ac64a42e2551cc30ae3e43a43bf5007b072bea2382dddcb6c42ff9148167e4dbdf98d81705d1',
    v: '0x1'
  },
  {
    address: '0x0000eb014f8c8b418DB6B45774C326A0e64C78914dc0',
    data: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
    hash: '0x23fe140efd3b576f9ce2da8b74152c2f52fee46a03224dbd065133ed564ab2c9',
    privateKey:
      '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
    // signature done with personal_sign
    r: '0x93df68f0cc6b00db0fb397fac0ffad63e95810c7cad6f2fd262ba7ed5ee2a325',
    s: '0x37b239e7675f328650a9beacbc9465d56625b607e462ffefd7f63039abc46a7b',
    signature:
      '0x93df68f0cc6b00db0fb397fac0ffad63e95810c7cad6f2fd262ba7ed5ee2a32537b239e7675f328650a9beacbc9465d56625b607e462ffefd7f63039abc46a7b1',
    v: '0x1'
  }
]

test('cs/accounts/hashMessage', () => {
  testData.forEach(item => {
    expect(Accounts.hashMessage(item.data)).toBe(item.hash)
  })
})

test('cs/accounts/sign', () => {
  testData.forEach(item => {
    expect(Accounts.sign(item.data, item.privateKey)).toEqual({
      message: item.data,
      messageHash: item.hash,
      r: item.r,
      s: item.s,
      signature: item.signature,
      v: item.v
    })
  })
})

test('cs/accounts/recover', () => {
  testData.forEach(item => {
    expect(Accounts.recover(item.data, item.signature)).toEqual(item.address)
  })

  testData.forEach(item => {
    expect(
      Accounts.recover(Accounts.hashMessage(item.data), item.signature, true)
    ).toEqual(item.address)
  })

  testData.forEach(item => {
    const sig = Accounts.sign(item.data, item.privateKey)
    expect(
      Accounts.recover(
        Accounts.hashMessage(item.data),
        sig.v,
        sig.r,
        sig.s,
        true
      )
    ).toEqual(item.address)
  })
  testData.forEach(item => {
    const data = Utils.isHexStrict(item.data)
      ? item.data
      : Utils.utf8ToHex(item.data)
    const sig = Accounts.sign(data, item.privateKey)
    expect(Accounts.recover(sig)).toEqual(item.address)
  })
  testData.forEach(item => {
    const sig = Accounts.sign(item.data, item.privateKey)
    expect(Accounts.recover(sig)).toEqual(item.address)
  })
  testData.forEach(item => {
    const data = Utils.isHexStrict(item.data)
      ? item.data
      : Utils.utf8ToHex(item.data)
    const sig = Accounts.sign(data, item.privateKey)
    expect(Accounts.recover(item.data, sig.v, sig.r, sig.s)).toEqual(
      item.address
    )
  })
  testData.forEach(item => {
    const sig = Accounts.sign(item.data, item.privateKey)
    expect(Accounts.recover(item.data, sig.v, sig.r, sig.s)).toEqual(
      item.address
    )
  })
})

test('cs/accounts/encrypt', () => {
  const seed =
    '0x1457fff042637cf08e36424a1ebcc8a185bb7a9b02e7899666ff3829fbea16f79d1156aea347e8ed9695d1f64c04ea30b1faf5cda9b27eb2bf3db7dca94fe318'
  const iv = '653195c3e2791ac53f3f19b125c18f8c'
  const salt =
    '3a1012583f8be138537bc7cf8a50c925b6fcc01a9f7744c85a18fbdc07999f10'
  const password = 'test'
  const uuid = 'ff31ddc3e2791ac53f3f19b125c18fff'
  const encryptResult = Accounts.encrypt(seed, password, {
    iv,
    salt,
    uuid
  })
  expect(encryptResult.crypto.ciphertext).toBe(
    'b70d90b219e718d9e19da2af6975249b37b0cafe01ca50d00fefc9341e492b0d415c8f62fcb9567fc03db19f6877d9873e430645827b69acb7cb574fa5511568'
  )
  expect(encryptResult.id).toBe('ff31ddc3-e279-4ac5-bf3f-19b125c18fff')
})

test('cs/accounts/decrypt', () => {
  const seed =
    '0x1457fff042637cf08e36424a1ebcc8a185bb7a9b02e7899666ff3829fbea16f79d1156aea347e8ed9695d1f64c04ea30b1faf5cda9b27eb2bf3db7dca94fe318'
  const iv = '653195c3e2791ac53f3f19b125c18f8c'
  const salt =
    '3a1012583f8be138537bc7cf8a50c925b6fcc01a9f7744c85a18fbdc07999f10'
  const password = 'test'
  const uuid = 'ff31ddc3e2791ac53f3f19b125c18fff'
  const encryptResult = Accounts.encrypt(seed, password, {
    iv,
    salt,
    uuid
  })

  const decryptResult = Accounts.decrypt(encryptResult, password)
  expect(decryptResult.seed).toBe(seed)
})

// test('cs/accounts/signTransaction', () => {
//   const transactionData = {
//     nonce: '0x0a',
//     to: '0x00000000000000000000000121321432423534534534',
//     hashLock: null,
//     timeLock: 0,
//     value: '10000',
//     fee: '10',
//     extraData: ''
//   }
//   const privateKey =
//     '0x289c2857d4598e37fb9647507e47a309d6133539bf21a8b9cb6df88fd5232031'
//   expect(Accounts.signTransaction(transactionData, privateKey)).toEqual({
//     hash: '0x528131488f97c6314b2fa0dff404f1037067e787b65cb244d79c7ecea007c0d5',
//     raw:
//       '0xf866df0a960000000000000000000000012132143242353453453480808227100a80f844a0f1bd5e6ffe6d3d1b78f7dc58a5e922229a5eba863e8d2dfa8e2e4df52837d2e4a0245a507467fb8e02001e61bb888b713c9cff16d3f2b798d62f5228f58eef961e3880',
//     tx: {
//       txData: transactionData,
//       witness: {
//         hashKey: null,
//         r: '0xf1bd5e6ffe6d3d1b78f7dc58a5e922229a5eba863e8d2dfa8e2e4df52837d2e4',
//         s: '0x245a507467fb8e02001e61bb888b713c9cff16d3f2b798d62f5228f58eef961e',
//         v: '0x38'
//       }
//     }
//   })
// })
