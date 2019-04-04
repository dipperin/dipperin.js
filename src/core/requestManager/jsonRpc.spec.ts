import JsonRpc from './jsonRpc'

test('core/requestManager/jsonRpc', () => {
  expect(JsonRpc.toPayload('method', [])).toEqual({
    id: 1,
    jsonrpc: '2.0',
    method: 'method',
    params: []
  })

  JsonRpc.toPayload('method', [])
  expect(JsonRpc.messageId).toBe(2)

  expect(() => {
    JsonRpc.toPayload('', [])
  }).toThrowError(Error)

  expect(
    JsonRpc.isValidResponse({
      id: 1,
      jsonrpc: '2.0',
      result: []
    })
  ).toBeTruthy()

  expect(
    JsonRpc.isValidResponse([
      {
        id: 1,
        jsonrpc: '2.0',
        result: []
      },
      {
        id: 2,
        jsonrpc: '2.0',
        result: []
      }
    ])
  ).toBeTruthy()

  expect(
    JsonRpc.isValidResponse({
      id: 1,
      jsonrpc: '',
      result: []
    })
  ).toBeFalsy()

  expect(
    JsonRpc.isValidResponse({
      id: 1,
      jsonrpc: '2.0',
      result: undefined
    })
  ).toBeFalsy()

  expect(
    JsonRpc.isValidResponse({
      id: undefined,
      jsonrpc: '2.0',
      result: []
    })
  ).toBeFalsy()

  expect(
    JsonRpc.isValidResponse({
      error: 'error',
      id: 1,
      jsonrpc: '2.0',
      result: []
    })
  ).toBeFalsy()

  expect(
    JsonRpc.toBatchPayload([
      {
        method: 'method',
        params: []
      },
      {
        method: 'method',
        params: []
      }
    ])
  ).toEqual([
    {
      id: 3,
      jsonrpc: '2.0',
      method: 'method',
      params: []
    },
    {
      id: 4,
      jsonrpc: '2.0',
      method: 'method',
      params: []
    }
  ])
})
