import WebsocketProvider from '../../providers/wsProvider'
import RequestManager from './index'

describe('core/requestManager', () => {
  it('constructor', () => {
    expect(() => {
      const rm = new RequestManager('http://localhost:8888')
      return rm
    }).not.toThrow()
  })
  it('setProvider', () => {
    const rm = new RequestManager('http://localhost:8888')
    const provider = new WebsocketProvider('ws://localhost:8888')
    const on = jest.spyOn(provider, 'on')
    rm.setProvider(provider)

    expect(on.mock.calls.length).toBe(1)
  })
  it('send', () => {
    const rm = new RequestManager('http://localhost:8888')
    const provider = new WebsocketProvider('ws://localhost:8888')
    const send = jest.spyOn(provider, 'send')
    rm.setProvider(provider)
    rm.send({
      method: 'method',
      params: []
    })

    expect(send.mock.calls.length).toBe(1)
  })
})
