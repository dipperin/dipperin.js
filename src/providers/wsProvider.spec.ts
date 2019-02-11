import WsProvider from './wsProvider'
import ws from 'isomorphic-ws'

jest.mock('isomorphic-ws')

const mockWs = (ws as any) as jest.Mock<typeof ws>

describe('Providers/WebsocketProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('constructor', () => {
    const host = 'ws://localhost:10000'
    const provider = new WsProvider(host)
    expect(mockWs.mock.calls[0][0]).toEqual(host)
    expect(provider.url).toEqual(host)
  })
})
