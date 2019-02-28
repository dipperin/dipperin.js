import ws from 'isomorphic-ws'
import { Server, WebSocket } from 'mock-socket'

import Helper from '../helper'
import WsProvider from './wsProvider'

const mockWs = (ws as any) as jest.Mock<WebSocket>

jest.mock('isomorphic-ws')

mockWs.mockImplementation(host => {
  return new WebSocket(host)
})

jest.useFakeTimers()

describe('Providers/WebsocketProvider', () => {
  const fakeURL = 'ws://localhost:10000'
  let mockServer: Server
  beforeEach(() => {
    mockServer = new Server(fakeURL)
    mockServer.start()
  })

  afterEach(() => {
    mockServer.close()
  })

  it('constructor, No options', () => {
    const host = 'ws://localhost:10000'
    const provider = new WsProvider(host)
    expect(provider.url).toEqual(host)
  })

  it('constructor, Have options', () => {
    const host = 'ws://localhost:10000'
    const provider = new WsProvider(host, {
      timeout: 10000
    })
    expect(provider.url).toEqual(host)
    expect(provider.customTimeout).toEqual(10000)
  })

  it('send, When the socket server is running normally', done => {
    const host = 'ws://localhost:10000'

    const provider = new WsProvider(host, {
      // timeout: 1
    })

    mockServer.on('connection', (socket: any) => {
      socket.on('message', () => {
        socket.send(
          JSON.stringify({
            method: 'method',
            id: 1
          })
        )
      })
    })

    // Skip the initialization process of mock-socket
    jest.runOnlyPendingTimers()

    provider.send(
      {
        method: 'method',
        params: [],
        id: 1
      },
      () => {
        expect(provider.isConnect()).toEqual(true)
        done()
      }
    )
    // Skip the sending process
    jest.runOnlyPendingTimers()
  })

  it('send, When the socket server is not working properly', done => {
    const host = 'ws://localhost:10001'

    const provider = new WsProvider(host, {
      timeout: 1
    })
    jest.runOnlyPendingTimers()
    provider.send(
      {
        method: 'method',
        params: []
      },
      err => {
        expect(err).toEqual(new Helper.Errors.InvalidConnectionError(host))
        done()
      }
    )
    jest.runOnlyPendingTimers()
  })

  it('on, Is not a function', () => {
    const host = 'ws://localhost:10001'

    const provider = new WsProvider(host, {
      timeout: 1
    })

    expect(() => {
      provider.on('data', undefined)
    }).toThrow(new Helper.Errors.InvalidCallbackError())
  })

  it('on, On open', done => {
    const onConnect = jest.fn()

    const host = 'ws://localhost:10000'

    const provider = new WsProvider(host, {
      timeout: 1
    })

    provider.on('connect', onConnect)

    jest.runOnlyPendingTimers()

    provider.send(
      {
        method: 'method',
        params: []
      },
      () => {
        expect(onConnect).toHaveBeenCalled()
        done()
      }
    )

    jest.runOnlyPendingTimers()
  })

  it('on, On close', done => {
    const onClose = jest.fn()

    const host = 'ws://localhost:10000'

    const provider = new WsProvider(host, {
      timeout: 1
    })

    provider.on('close', onClose)

    jest.runOnlyPendingTimers()

    provider.send(
      {
        method: 'method',
        params: []
      },
      () => {
        mockServer.close()
        expect(onClose).toHaveBeenCalled()
        done()
      }
    )

    jest.runOnlyPendingTimers()
  })

  it('on, On error', done => {
    const onError = jest.fn()

    const host = 'ws://localhost:10001'

    const provider = new WsProvider(host, {
      timeout: 1
    })

    provider.removeAllListeners('error')

    provider.on('error', onError)

    jest.runOnlyPendingTimers()

    provider.send(
      {
        method: 'method',
        params: []
      },
      () => {
        expect(onError).toHaveBeenCalled()
        done()
      }
    )

    jest.runOnlyPendingTimers()
  })

  it('removeListener', () => {
    const host = 'ws://localhost:10000'
    const mockFN = jest.fn()
    const provider = new WsProvider(host, {
      timeout: 1
    })

    provider.on('data', mockFN)

    expect(provider.notificationCallbacks).toContain(mockFN)

    provider.removeListener('data', mockFN)

    expect(provider.notificationCallbacks).not.toContain(mockFN)
  })

  it('removeAllListeners', () => {
    const host = 'ws://localhost:10000'
    const mockFN = jest.fn()
    const provider = new WsProvider(host, {
      timeout: 1
    })

    provider.on('data', mockFN)
    provider.on('end', mockFN)
    provider.on('connect', mockFN)
    provider.on('error', mockFN)

    expect(provider.notificationCallbacks[0]).toEqual(mockFN)

    provider.removeAllListeners('data')
    provider.removeAllListeners('end')
    provider.removeAllListeners('connect')
    provider.removeAllListeners('error')

    expect(provider.notificationCallbacks).toHaveLength(0)
    expect(provider.connection.onerror).toEqual(undefined)
    expect(provider.connection.onclose).toEqual(undefined)
    expect(provider.connection.onopen).toEqual(undefined)
  })

  it('onMessage, Non-array result', done => {
    const host = 'ws://localhost:10000'
    const provider = new WsProvider(host, {
      // timeout:1000
    })

    mockServer.on('connection', (socket: any) => {
      socket.on('message', () => {
        socket.send(
          JSON.stringify({
            method: 'test',
            id: 1
          })
        )
      })
    })

    jest.runOnlyPendingTimers()

    provider.send(
      {
        method: 'method',
        params: [],
        id: 1
      },
      (_, data) => {
        expect(data).toEqual({
          method: 'test',
          id: 1
        })
        done()
      }
    )

    jest.runOnlyPendingTimers()
  })

  it('onMessage, Array result', done => {
    const host = 'ws://localhost:10000'
    const provider = new WsProvider(host, {
      // timeout:1000
    })

    mockServer.on('connection', (socket: any) => {
      socket.on('message', () => {
        socket.send(
          JSON.stringify([
            {
              method: 'test',
              id: 1
            }
          ])
        )
      })
    })

    jest.runOnlyPendingTimers()

    provider.send(
      [
        {
          method: 'method',
          params: [],
          id: 1
        }
      ],
      (_, data) => {
        expect(data).toEqual([
          {
            method: 'test',
            id: 1
          }
        ])
        done()
      }
    )

    jest.runOnlyPendingTimers()
  })

  it('onMessage, Invalid result', done => {
    expect(() => {
      const host = 'ws://localhost:10000'
      const provider = new WsProvider(host, {
        // timeout:1000
      })

      mockServer.on('connection', (socket: any) => {
        socket.on('message', () => {
          socket.send('test')
          jest.runOnlyPendingTimers()
        })
      })

      jest.runOnlyPendingTimers()
      provider.send(
        [
          {
            method: 'method',
            params: [],
            id: 1
          }
        ],
        err => {
          expect(err).toEqual(new Helper.Errors.InvalidConnectionError('on WS'))
          done()
        }
      )
      jest.runOnlyPendingTimers()
    }).toThrow(new Helper.Errors.InvalidResponseError('test'))
  })
})
