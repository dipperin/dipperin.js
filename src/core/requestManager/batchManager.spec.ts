import Helper from '../../helper'
import BatchManager from './batchManager'
import RequestManager from './index'

test('core/requestManager/batchManager', () => {
  const rm = new RequestManager()

  rm.sendBatch = (_, callback) => {
    callback(null, _)
  }

  const bm = new BatchManager(rm)

  bm.add({
    callback: () => null,
    method: 'method',
    params: []
  })

  expect(bm.requests.length).toBe(1)

  expect(() => {
    bm.execute()
  }).not.toThrowError('no error')

  rm.sendBatch = (_, callback) => {
    callback(new Helper.Errors.ConnectionTimeoutError('10'), null)
  }

  expect(() => {
    bm.execute()
  }).toThrowError(Helper.Errors.ConnectionTimeoutError)
})
