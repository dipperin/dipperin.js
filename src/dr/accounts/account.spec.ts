import Helper from '../../helper'
import Account from './account'

test('cs/Account/constructor', () => {
  const account1 = new Account()

  let account2: Account
  let account3: Account

  expect(() => {
    account2 = new Account({
      extendedKey: account1.privateExtendedKey
    })
    account3 = new Account({
      extendedKey: account1.publicExtendedKey
    })
  }).not.toThrow()

  expect(account1.privateKey).toEqual(account2.privateKey)

  expect(account1.publicKey).toEqual(account3.publicKey)

  expect(account3.privateExtendedKey).toEqual(null)

  expect(account3.privateKey).toEqual(null)
})

test('cs/Account/derivePath', () => {
  const account = new Account({
    seed:
      '0xed23924c18e52094aa35bbf6b2e3eae1cdd48dba52e4740109ce14e753b13c7c188d2d60ea0fc98ba4974d02baf2a6a4df67ee0b8787464d9ed88c6fb9b7ef0c5dcc308b965ef0b98f46e23566ae6847fc3e65cd7d6d6bef8426035fb3133a7384399dde030a9271f4ac73b9e3439d9d3c4827675af62782f60fbd9430c602d2'
  })
  let childAccount1: Account

  expect(() => {
    childAccount1 = account.derivePath('fsd')
  }).toThrow('Path must start with "m" or "M"')

  expect(() => {
    childAccount1 = account.derivePath("m/44'/1")
  }).not.toThrow()

  expect(childAccount1.privateKey).toEqual(
    '0x09ff97309a4e335d1291693ec794651f143b53adbc21fcc4bbc02b49a6f3316b'
  )

  expect(childAccount1.publicKey).toEqual(
    '0x03c6787f018a17103abbd7d3ca6c3293545c3e687ff0d63464633ee4a1748ef6d5'
  )

  expect(
    Helper.Account.privateToPublicKey(childAccount1.privateKey, true)
  ).toEqual(
    '03c6787f018a17103abbd7d3ca6c3293545c3e687ff0d63464633ee4a1748ef6d5'
  )
})

test('cs/Account/deriveChild', () => {
  const account = new Account({
    seed:
      '0xed23924c18e52094aa35bbf6b2e3eae1cdd48dba52e4740109ce14e753b13c7c188d2d60ea0fc98ba4974d02baf2a6a4df67ee0b8787464d9ed88c6fb9b7ef0c5dcc308b965ef0b98f46e23566ae6847fc3e65cd7d6d6bef8426035fb3133a7384399dde030a9271f4ac73b9e3439d9d3c4827675af62782f60fbd9430c602d2'
  })

  let childAccount1: Account

  expect(() => {
    childAccount1 = account.deriveChild(-13)
  }).toThrowError()

  expect(() => {
    childAccount1 = account.deriveChild(1)
  }).not.toThrow()

  expect(childAccount1.privateKey).toEqual(
    '0xf9e299feafe0c1ad01e12e238caa549fc34a0b1e5bbc7ca572dbfdcfee1dfcf2'
  )

  expect(childAccount1.publicKey).toEqual(
    '0x025d89fe223f7068527d291b7dfdaef7cee39c1f57fa599481978eaeb557d54f3c'
  )

  expect(
    Helper.Account.privateToPublicKey(childAccount1.privateKey, true)
  ).toEqual(
    '025d89fe223f7068527d291b7dfdaef7cee39c1f57fa599481978eaeb557d54f3c'
  )
})
