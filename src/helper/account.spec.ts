import Utils from '../utils'
import account from './account'

test('lib/account/toChecksum', () => {
  expect(
    account.toChecksum('0x000032Be343B94f860124dC4fEe278FDCBD38C102D88')
  ).toBe('0x000032BE343B94f860124dC4FEe278FDCBD38C102D88')
})

test('lib/account/fromPrivate', () => {
  expect(
    account.fromPrivate(
      '0x4646464646464646464646464646464646464646464646464646464646464646'
    )
  ).toEqual('0x00009d8a62f656A8d1615c1294FD71E9Cfb3E4855a4F')
  expect(
    account.fromPrivate(
      '0x2d24b2462ba4a2de2d00602e039bf9591dc27fcfd53bc6c523a260995cb6d628'
    )
  ).toEqual('0x000081085E64f96d76B044ff83b3710c80b5902Eb296')
  expect(
    account.fromPrivate(
      '0x289c2857d4598e37fb9647507e47a309d6133539bf21a8b9cb6df88fd5232032'
    )
  ).toEqual('0x0000970e8128aB834E8EAC17aB8E3812f010678CF791')
  expect(
    account.fromPrivate(
      '0x289c2857d4598e37fb9647507e47a309d6133539bf21a8b9cb6df88fd5232031'
    )
  ).toEqual('0x00005586B883Ec6dd4f8c26063E18eb4Bd228e59c3E9')
})

test('lib/account/privateToPublicKey', () => {
  expect(
    account.privateToPublicKey(
      '0x289c2857d4598e37fb9647507e47a309d6133539bf21a8b9cb6df88fd5232032',
      true
    )
  ).toBe('037db227d7094ce215c3a0f57e1bcc732551fe351f94249471934567e0f5dc1bf7')
  expect(
    account.privateToPublicKey(
      '0x289c2857d4598e37fb9647507e47a309d6133539bf21a8b9cb6df88fd5232031',
      true
    )
  ).toBe('0390a8c392f473e0c2dcb4c484f155db64eb7256034c6c108159ec99c9ba144cf7')
  expect(
    account.privateToPublicKey(
      '0x7dad8caa26a638826ccfd3e7a4430b2932db43b38d70b7b3297a0037834b587e',
      false
    )
  ).toBe(
    '04b7142214d702e8387d29b55bef4a0cb5c3d8e081f9791e4d026d20db09e796cc9f3e1dc6ef8350bc1d3884bef23b6e1897ea1740baa175f3781716fe30ca4183'
  )
  expect(
    account.privateToPublicKey(
      '0x289c2857d4598e37fb9647507e47a309d6133539bf21a8b9cb6df88fd5232031'
    )
  ).toEqual(
    '0490a8c392f473e0c2dcb4c484f155db64eb7256034c6c108159ec99c9ba144cf79821af1f61dd5b89fb7d81dc695a888bd048548e01b488ed1146ed585c281f7b'
  )
  expect(
    account.privateToPublicKey(
      '0x289c2857d4598e37fb9647507e47a309d6133539bf21a8b9cb6df88fd5232031',
      true
    )
  ).toEqual(
    '0390a8c392f473e0c2dcb4c484f155db64eb7256034c6c108159ec99c9ba144cf7'
  )
})

test('lib/account/fromPublic', () => {
  expect(
    account.fromPublic(
      '4bc2a31265153f07e70e0bab08724e6b85e217f8cd628ceb62974247bb493382ce28cab79ad7119ee1ad3ebcdb98a16805211530ecc6cfefa1b88e6dff99232a'
    )
  ).toBe('0x00009d8a62f656A8d1615c1294FD71E9Cfb3E4855a4F')
  expect(
    account.fromPublic(
      '0x024bc2a31265153f07e70e0bab08724e6b85e217f8cd628ceb62974247bb493382'
    )
  ).toBe('0x00009d8a62f656A8d1615c1294FD71E9Cfb3E4855a4F')
  expect(
    account.fromPublic(
      '0x0390a8c392f473e0c2dcb4c484f155db64eb7256034c6c108159ec99c9ba144cf7'
    )
  ).toEqual('0x00005586B883Ec6dd4f8c26063E18eb4Bd228e59c3E9')
})

test('lib/account/genContractAddress', () => {
  expect(Utils.isContractAddress(account.genContractAddress()))
  expect(Utils.isContractAddress(account.genContractAddress()))
})

test('lib/account/makeSigner', () => {
  expect(
    account.makeSigner(56)(
      '0x69196b681582f4a42bfb9445e9c10889ed7662695b177483752abb7d4c0f193e',
      '0x289c2857d4598e37fb9647507e47a309d6133539bf21a8b9cb6df88fd5232031'
    )
  ).toEqual(
    '0xf1bd5e6ffe6d3d1b78f7dc58a5e922229a5eba863e8d2dfa8e2e4df52837d2e4245a507467fb8e02001e61bb888b713c9cff16d3f2b798d62f5228f58eef961e38'
  )
})

test('lib/account/recover', () => {
  expect(
    account.recover(
      '0x69196b681582f4a42bfb9445e9c10889ed7662695b177483752abb7d4c0f193e',
      '0xf1bd5e6ffe6d3d1b78f7dc58a5e922229a5eba863e8d2dfa8e2e4df52837d2e4245a507467fb8e02001e61bb888b713c9cff16d3f2b798d62f5228f58eef961e38'
    )
  ).toEqual('0x00005586B883Ec6dd4f8c26063E18eb4Bd228e59c3E9')
})
