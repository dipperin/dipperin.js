import Wallet from './index'

test('cs/wallet', () => {
  const wallet = new Wallet()
  wallet.create(5)

  expect(wallet.length).toBe(5)

  wallet.add(
    '0xed23924c18e52094aa35bbf6b2e3eae1cdd48dba52e4740109ce14e753b13c7c188d2d60ea0fc98ba4974d02baf2a6a4df67ee0b8787464d9ed88c6fb9b7ef0c5dcc308b965ef0b98f46e23566ae6847fc3e65cd7d6d6bef8426035fb3133a7384399dde030a9271f4ac73b9e3439d9d3c4827675af62782f60fbd9430c602d2'
  )

  expect(wallet.length).toBe(6)

  expect(
    wallet.getAccounts('0x0000a795Bd89a8F10Da49C796Fb72A83EFAc559d156B').address
  ).toBe('0x0000a795Bd89a8F10Da49C796Fb72A83EFAc559d156B')
  expect(wallet.getAccounts(6).address).toBe(
    '0x0000a795Bd89a8F10Da49C796Fb72A83EFAc559d156B'
  )
  expect(
    wallet.getAccounts(
      '0x0000a795Bd89a8F10Da49C796Fb72A83EFAc559d156B'.toLocaleLowerCase()
    ).address
  ).toBe('0x0000a795Bd89a8F10Da49C796Fb72A83EFAc559d156B')

  wallet.remove('0x0000a795Bd89a8F10Da49C796Fb72A83EFAc559d156B')
  expect(wallet.length).toBe(5)
  expect(
    wallet.getAccounts('0x0000a795Bd89a8F10Da49C796Fb72A83EFAc559d156B')
  ).toBe(undefined)

  const encryptResults = wallet.encrypt('123')

  wallet.clear()
  expect(wallet.length).toBe(0)

  wallet.decrypt(encryptResults, '123')
  expect(wallet.length).toBe(5)
})
