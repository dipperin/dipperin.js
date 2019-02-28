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

  it('isConnecting, success', () => {
    const provider = new HttpProvider('http://localhost:8888')
    const net = new Net(provider)
    const mockGetConnecting = jest.fn().mockImplementation(() => true)
    net.getConnecting = mockGetConnecting

    net.isConnecting((res: boolean) => {
      expect(res).toEqual(true)
    })
  })

  it('isConnecting, fail', () => {
    const provider = new HttpProvider('http://localhost:8888')
    const net = new Net(provider)
    const mockGetConnecting = jest.fn(() => {
      throw new Error('')
    })
    net.getConnecting = mockGetConnecting

    net.isConnecting((res: boolean) => {
      expect(res).toEqual(false)
    })
  })
})
