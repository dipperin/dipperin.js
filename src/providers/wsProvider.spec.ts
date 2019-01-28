import WsProvider from './wsProvider'

describe.only('providers/wsProviders', () => {
  it('constructor', () => {
    const wsProvider = new WsProvider('ws:172.16.0.1:8888', {
      timeout: 1000
    })
    expect(wsProvider.customTimeout).toBe(1000)
  })

  it('listener', () => {
    const wsProvider = new WsProvider('ws:172.16.0.1:8888')

    const noop1 = () => null
    const noop2 = () => null

    wsProvider.on('data', noop1)
    wsProvider.on('data', noop2)
    wsProvider.on('connect', noop2)
    wsProvider.on('end', noop2)
    wsProvider.on('error', noop2)

    expect(wsProvider.notificationCallbacks.length).toBe(2)

    wsProvider.removeListener('data', noop1)

    expect(wsProvider.notificationCallbacks.length).toBe(1)

    wsProvider.removeAllListeners('data')
    wsProvider.removeAllListeners('connect')
    wsProvider.removeAllListeners('end')
    wsProvider.removeAllListeners('error')

    expect(wsProvider.notificationCallbacks.length).toBe(0)

    wsProvider.on('data', noop1)
    wsProvider.on('data', noop2)
    wsProvider.on('connect', noop2)
    wsProvider.on('end', noop2)
    wsProvider.on('error', noop2)

    expect(wsProvider.notificationCallbacks.length).toBe(2)

    wsProvider.reset()

    expect(wsProvider.notificationCallbacks.length).toBe(0)
  })
})
