import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Helper from '../helper'
import HttpProvider from './httpProvider'

const mock = new MockAdapter(axios)

test('httpProvider/send', done => {
  mock
    .onPost('/', { id: 1, jsonprc: '2.0', method: 'test1', params: {} })
    .reply(200, { a: 1 })
  const provider = new HttpProvider()
  provider.send(
    { id: 1, jsonprc: '2.0', method: 'test1', params: {} },
    (_, res) => {
      expect(typeof res).toBe('object')
      done()
    }
  )
})

test('httpProvider/send error', done => {
  mock
    .onPost('/', { id: 2, jsonprc: '2.0', method: 'test2', params: {} })
    .networkError()
  const provider = new HttpProvider()
  provider.send(
    { id: 2, jsonprc: '2.0', method: 'test2', params: {} },
    (err, _) => {
      expect(err instanceof Helper.Errors.InvalidConnectionError).toBe(true)
      done()
    }
  )
})

test('httpProvider/send timeout', done => {
  mock
    .onPost('/', { id: 3, jsonprc: '2.0', method: 'test3', params: {} })
    .timeout()
  const provider = new HttpProvider()
  provider.send(
    { id: 3, jsonprc: '2.0', method: 'test3', params: {} },
    (err, _) => {
      expect(err instanceof Helper.Errors.InvalidConnectionError).toBe(true)
      done()
    }
  )
})
