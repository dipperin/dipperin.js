import HttpProvider from '../providers/httpProvider'
import Net from './index'

describe('net', () => {
  it('constructor', () => {
    expect(() => {
      const provider = new HttpProvider('http://localhost:8888')
      const net = new Net(provider)
      return net
    }).not.toThrow()
  })
})
