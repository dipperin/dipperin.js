import Dipperin from './index'
import Provider from './providers/httpProvider'
describe('dipperin', () => {
  it('constructor', () => {
    expect(() => {
      const dipperin = new Dipperin('http://localhost:8888')
      return dipperin
    }).not.toThrow()
  })

  it('setProvider', () => {
    const provider = new Provider('http://localhost:8888')
    const dipperin = new Dipperin('http://localhost:8888')
    dipperin.setProvider(provider)
    expect(dipperin.provider).toEqual(provider)
  })
})
