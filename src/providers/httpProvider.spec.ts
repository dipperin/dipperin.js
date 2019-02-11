import axios from 'axios'
import Helper from '../helper'
import HttpProvider from './httpProvider'

jest.mock('axios')

describe('Providers/HttpProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('send, Send a request and get the normal return value', done => {
    const result = { a: 1 }

    axios.create = jest.fn().mockImplementation(() => {
      return () => ({ data: result })
    })
    const provider = new HttpProvider()
    provider.send(
      { id: 1, jsonprc: '2.0', method: 'test1', params: {} },
      (_, res) => {
        expect(res).toEqual(result)
        done()
      }
    )
  })

  it('send, Send a request with headers', done => {
    const result = { a: 1 }

    const mockAxiosCreate = jest.fn().mockImplementation(() => {
      return () => ({ data: result })
    })

    axios.create = mockAxiosCreate

    const provider = new HttpProvider('localhost:8583', 0, [
      {
        name: 'test',
        value: 'test'
      }
    ])
    provider.send(
      { id: 1, jsonprc: '2.0', method: 'test1', params: {} },
      (_, res) => {
        expect(mockAxiosCreate.mock.calls[0][0].headers).toEqual({
          test: 'test',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        })
        expect(res).toEqual(result)
        done()
      }
    )
  })

  it('send, Send a request and return 404', done => {
    const host = 'http://localhost:8545'

    axios.create = jest.fn().mockImplementation(() => {
      return () => {
        throw {
          response: {
            status: 404
          }
        }
      }
    })
    const provider = new HttpProvider()
    provider.send(
      { id: 1, jsonprc: '2.0', method: 'test1', params: {} },
      (err, res) => {
        expect(res).toEqual(null)
        expect(err).toEqual(new Helper.Errors.InvalidConnectionError(host))
        done()
      }
    )
  })

  it('send, Send a request and return 405', done => {
    axios.create = jest.fn().mockImplementation(() => {
      return () => {
        throw {
          response: {
            status: 405,
            statusText: 'Not Allow Method'
          }
        }
      }
    })
    const provider = new HttpProvider()
    provider.send(
      { id: 1, jsonprc: '2.0', method: 'test1', params: {} },
      (err, res) => {
        expect(res).toEqual(null)
        expect(err).toEqual(new Helper.Errors.ResponseError('Not Allow Method'))
        done()
      }
    )
  })

  it('send, Send a request and return 400', done => {
    axios.create = jest.fn().mockImplementation(() => {
      return () => {
        throw {
          response: {
            status: 400,
            data: {
              error: 'error'
            }
          }
        }
      }
    })
    const provider = new HttpProvider()
    provider.send(
      { id: 1, jsonprc: '2.0', method: 'test1', params: {} },
      (err, res) => {
        expect(res).toEqual(null)
        expect(err).toEqual(new Helper.Errors.ResponseError('error'))
        done()
      }
    )
  })

  it('send, Send a request and return 500', done => {
    axios.create = jest.fn().mockImplementation(() => {
      return () => {
        throw {
          response: {
            status: 500,
            data: {
              error: 'error'
            }
          }
        }
      }
    })
    const provider = new HttpProvider()
    provider.send(
      { id: 1, jsonprc: '2.0', method: 'test1', params: {} },
      (err, res) => {
        expect(res).toEqual(null)
        expect(err).toEqual(new Helper.Errors.ResponseError('error'))
        done()
      }
    )
  })

  it('send, Send a request and return unknown status', done => {
    const host = 'http://localhost:8545'
    axios.create = jest.fn().mockImplementation(() => {
      return () => {
        throw {
          response: {
            status: 407,
            data: {
              error: 'error'
            }
          }
        }
      }
    })
    const provider = new HttpProvider(host)
    provider.send(
      { id: 1, jsonprc: '2.0', method: 'test1', params: {} },
      (err, res) => {
        expect(res).toEqual(null)
        expect(err).toEqual(new Helper.Errors.InvalidConnectionError(host))
        done()
      }
    )
  })

  it('send, Send a request and no response', done => {
    const host = 'http://localhost:8545'
    axios.create = jest.fn().mockImplementation(() => {
      return () => {
        throw {
          message: 'error'
        }
      }
    })
    const provider = new HttpProvider(host)
    provider.send(
      { id: 1, jsonprc: '2.0', method: 'test1', params: {} },
      (err, res) => {
        expect(res).toEqual(null)
        expect(err).toEqual(new Error('error'))
        done()
      }
    )
  })
})
