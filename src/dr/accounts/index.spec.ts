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
    hash: '0x43a26051362b8040b289abe93334a5e3662751aa691185ae9e9a2e1e0c169350',
    privateKey:
      '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
    r: '0xbbae52f4cd6776e66e01673228474866cead8ccc9530e0ae06b42d0f5917865f',
    s: '0x170e7a9e792288955e884c9b2da7d2c69b69d3b29e24372d1dec1164a7deaec0',
    signature:
      '0xbbae52f4cd6776e66e01673228474866cead8ccc9530e0ae06b42d0f5917865f170e7a9e792288955e884c9b2da7d2c69b69d3b29e24372d1dec1164a7deaec001',
    v: '0x01'
  },
  {
    address: '0x0000eb014f8c8b418DB6B45774C326A0e64C78914dc0',
    data: 'Some data!%$$%&@*',
    hash: '0x45d7b02473ee873d3311859ef26b7a741e80cc57c1c4e8e2e30c2c93afb7dfe1',
    privateKey:
      '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
    r: '0x91b3ccd107995becaca361e9f282723176181bb9250e8ebb8a5119f5e0b91978',
    s: '0x5e67773c632e036712befe130577d2954b91f7c5fb4999bc94d80d471dfd468b',
    signature:
      '0x91b3ccd107995becaca361e9f282723176181bb9250e8ebb8a5119f5e0b919785e67773c632e036712befe130577d2954b91f7c5fb4999bc94d80d471dfd468b01',
    v: '0x01'
  },
  {
    address: '0x0000eb014f8c8b418DB6B45774C326A0e64C78914dc0',
    data: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
    hash: '0x10ca3eff73ebec87d2394fc58560afeab86dac7a21f5e402ea0a55e5c8a6758f',
    privateKey:
      '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
    // signature done with personal_sign
    r: '0xff592a34f5597e8e6661d8d3fb194321d10f1aefce878c5a6a5d5b25b121a03b',
    s: '0x65b7bed06c680243109062e2a9ff973b173c17232e67034a8136162721438bba',
    signature:
      '0xff592a34f5597e8e6661d8d3fb194321d10f1aefce878c5a6a5d5b25b121a03b65b7bed06c680243109062e2a9ff973b173c17232e67034a8136162721438bba01',
    v: '0x01'
  },
  {
    address: '0x000085E15e074806F1d123a2Bd925D2c60D627Fd8b2e',
    data: '1576724634',
    hash: '0x9e8e3df60d15289a7bbe87de757b663b66babcb83c09c5865cd3cc596564c365',
    privateKey:
      '0x01419eb10513cfa9a2bf371df4f57b3edd8646dbe17b862ab1aeb429e0db1fc8',
    // signature done with personal_sign
    r: '0xe897b28dfbad11e3c2c658befb69952292495e6757f68a1c0fe055a1b208d21a',
    s: '0x336219afa92a1877438e14f3948feb4a4c7fbb44197e6f5b52d9120397ad966aq',
    signature:
      '0xe897b28dfbad11e3c2c658befb69952292495e6757f68a1c0fe055a1b208d21a336219afa92a1877438e14f3948feb4a4c7fbb44197e6f5b52d9120397ad966a01',
    v: '0x01'
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

// test('test/recover', () => {
//   const item = {
//     address: "0x000085E15e074806F1d123a2Bd925D2c60D627Fd8b2e",
//     extraData: "0x66726f6d20646970706572696e2077616c6c657420657874656e73696f6e",
//     v: "0x38",
//     r: "0xfb2af08c272ee80a08f060479683d69386f1e890b3dda1353b8f846bbd8de47f",
//     s: "0x422fb41bb29be282769eb8da990ba565d3979ea0a49d6ad09c0d94b964bbe9c6",
//   }
//   expect(
//     Accounts.recover(
//       item.extraData,
//       item.v,
//       item.r,
//       item.s,
//       true
//     )
//   ).toEqual(item.address)
// })

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
