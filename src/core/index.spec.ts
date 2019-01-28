import Core from './index'
import { HttpProvider } from '../providers'

const provider = new HttpProvider('localhost:3000')

test('core/constructor', () => {
  const core = new Core(provider)
  expect(core.provider).toEqual(provider)
})

test('core/get currentProvider', () => {
  const core = new Core(provider)
  core.currentProvider = provider
  expect(core.provider).toEqual(provider)
})

test('core/setProvider', () => {
  const core = new Core(provider)
  // core.setProvider(provider) //todo
  expect(core.provider).toEqual(provider)
})
