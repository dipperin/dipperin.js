import Chainstack from './index'
import Provider from './providers/httpProvider'
describe('chainstack', () => {
  it('constructor', () => {
    expect(() => {
      const chainstack = new Chainstack('http://localhost:8888')
      return chainstack
    }).not.toThrow()
  })

  it('setProvider', () => {
    const provider = new Provider('http://localhost:8888')
    const chainstack = new Chainstack('http://localhost:8888')
    chainstack.setProvider(provider)
    expect(chainstack.provider).toEqual(provider)
  })
})
