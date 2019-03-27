import RequestManager from '../requestManager'
import Subscription from './index'
import Helper from '../../helper'

describe('Core/Subscription', () => {
  it('subscribe, Passing the argument is illegal', () => {
    const rm = new RequestManager()
    const mockRmSend = jest.fn()
    rm.send = mockRmSend
    const ss: Subscription = new Subscription({
      requestManager: rm,
      subscriptionName: 'type',
      paramsNum: 2
    })
    expect(() => {
      ss.subscribe()
    }).toThrow(new Helper.Errors.InvalidNumberOfParamsError(0, 2, undefined))

    expect(mockRmSend).not.toHaveBeenCalled()
  })

  it('subscribe, Lack of provider and without callback', () => {
    const onError = jest.fn()
    const rm = new RequestManager()
    const mockRmSend = jest.fn()
    rm.send = mockRmSend
    const ss: Subscription = new Subscription({
      requestManager: rm,
      subscriptionName: 'type',
      paramsNum: 0
    })

    ss.on('error', onError)
    ss.subscribe()

    expect(onError).toHaveBeenCalled()
    expect(onError.mock.calls[0][0]).toEqual(
      new Helper.Errors.InvalidProviderError()
    )
    expect(mockRmSend).not.toHaveBeenCalled()
  })

  it('subscribe, Lack of provider and with callback', () => {
    const onError = jest.fn()
    const callback = jest.fn()
    const rm = new RequestManager()
    const mockRmSend = jest.fn()
    rm.send = mockRmSend
    const ss: Subscription = new Subscription({
      requestManager: rm,
      subscriptionName: 'type',
      paramsNum: 0
    })

    ss.on('error', onError)
    ss.subscribe(callback)

    expect(onError).toHaveBeenCalled()
    expect(onError.mock.calls[0][0]).toEqual(
      new Helper.Errors.InvalidProviderError()
    )
    expect(callback).toHaveBeenCalled()
    expect(callback.mock.calls[0][0]).toEqual(
      new Helper.Errors.InvalidProviderError()
    )
    expect(mockRmSend).not.toHaveBeenCalled()
  })

  it('subscribe, Provider does not support subscriptions and without callback', () => {
    const onError = jest.fn()
    const rm = new RequestManager('http://localhost:10000')
    const mockRmSend = jest.fn()
    rm.send = mockRmSend
    const ss: Subscription = new Subscription({
      requestManager: rm,
      subscriptionName: 'type',
      paramsNum: 0
    })

    ss.on('error', onError)
    ss.subscribe()

    expect(onError).toHaveBeenCalled()
    expect(onError.mock.calls[0][0]).toEqual(
      new Helper.Errors.UnsupportedSubscriptionsProviderError(
        rm.provider.constructor.name
      )
    )
    expect(mockRmSend).not.toHaveBeenCalled()
  })

  it('subscribe, Provider does not support subscriptions and with callback', () => {
    const onError = jest.fn()
    const callback = jest.fn()
    const rm = new RequestManager('http://localhost:10000')
    const mockRmSend = jest.fn()
    rm.send = mockRmSend
    const ss: Subscription = new Subscription({
      requestManager: rm,
      subscriptionName: 'type',
      paramsNum: 0
    })

    ss.on('error', onError)
    ss.subscribe(callback)

    expect(onError).toHaveBeenCalled()
    expect(onError.mock.calls[0][0]).toEqual(
      new Helper.Errors.UnsupportedSubscriptionsProviderError(
        rm.provider.constructor.name
      )
    )
    expect(callback).toHaveBeenCalled()
    expect(callback.mock.calls[0][0]).toEqual(
      new Helper.Errors.UnsupportedSubscriptionsProviderError(
        rm.provider.constructor.name
      )
    )
    expect(mockRmSend).not.toHaveBeenCalled()
  })

  it('subscribe, Send return error and without callback', () => {
    const onError = jest.fn()
    const rm = new RequestManager('ws://localhost:10000')
    rm.send = jest.fn().mockImplementation((_, cb) => {
      cb(new Error('error'))
    })

    const ss: Subscription = new Subscription({
      requestManager: rm,
      subscriptionName: 'type',
      paramsNum: 0
    })

    ss.on('error', onError)
    ss.subscribe()

    expect(onError).toHaveBeenCalled()
    expect(onError.mock.calls[0][0]).toEqual(new Error('error'))
  })

  it('subscribe, Send return error and with callback', () => {
    const onError = jest.fn()
    const callback = jest.fn()
    const rm = new RequestManager('ws://localhost:10000')
    rm.send = jest.fn().mockImplementation((_, cb) => {
      cb(new Error('error'))
    })

    const ss: Subscription = new Subscription({
      requestManager: rm,
      subscriptionName: 'type',
      paramsNum: 0
    })

    ss.on('error', onError)
    ss.subscribe(callback)

    expect(onError).toHaveBeenCalled()
    expect(onError.mock.calls[0][0]).toEqual(new Error('error'))
    expect(callback).toHaveBeenCalled()
    expect(callback.mock.calls[0][0]).toEqual(new Error('error'))
  })

  it('subscribe, The subscription is normal, but the result returned is not an array, and the callback function is not passed in from', () => {
    const onData = jest.fn()
    const rm = new RequestManager('ws://localhost:10000')
    rm.send = jest.fn().mockImplementation((_, cb) => {
      cb(null, 1)
    })

    rm.addSubscription = jest.fn().mockImplementation((_, __, ___, cb) => {
      cb(null, 'test')
    })

    const ss: Subscription = new Subscription({
      requestManager: rm,
      subscriptionName: 'type',
      paramsNum: 0
    })

    ss.on('data', onData)

    ss.subscribe()

    expect(onData).toHaveBeenCalled()
    expect(onData.mock.calls[0][0]).toEqual('test')
  })

  it('subscribe, The subscription is normal, but the result returned is not an array, and have the callback function', () => {
    const onData = jest.fn()
    const callback = jest.fn()
    const rm = new RequestManager('ws://localhost:10000')
    rm.send = jest.fn().mockImplementation((_, cb) => {
      cb(null, 1)
    })

    rm.addSubscription = jest.fn().mockImplementation((_, __, ___, cb) => {
      cb(null, 'test')
    })

    const ss: Subscription = new Subscription({
      requestManager: rm,
      subscriptionName: 'type',
      paramsNum: 0
    })

    ss.on('data', onData)

    ss.subscribe(callback)

    expect(onData).toHaveBeenCalled()
    expect(onData.mock.calls[0][0]).toEqual('test')

    expect(callback).toHaveBeenCalled()
    expect(callback.mock.calls[0][1]).toEqual('test')
  })

  it('subscribe, There is a problem with the subscription, and the callback function is not passed in.', () => {
    const onError = jest.fn()
    const rm = new RequestManager('ws://localhost:10000')
    rm.send = jest.fn().mockImplementation((_, cb) => {
      cb(null, 1)
    })

    rm.addSubscription = jest.fn().mockImplementation((_, __, ___, cb) => {
      cb(new Error('error'))
    })

    const ss: Subscription = new Subscription({
      requestManager: rm,
      subscriptionName: 'type',
      paramsNum: 0
    })

    ss.on('error', onError)

    ss.subscribe()

    expect(onError).toHaveBeenCalled()
    expect(onError.mock.calls[0][0]).toEqual(new Error('error'))
  })

  it('subscribe, There is a problem with the subscription, and the callback function has been passed in.', () => {
    const onError = jest.fn()
    const callback = jest.fn()
    const rm = new RequestManager('ws://localhost:10000')
    rm.send = jest.fn().mockImplementation((_, cb) => {
      cb(null, 1)
    })

    rm.addSubscription = jest.fn().mockImplementation((_, __, ___, cb) => {
      cb(new Error('error'))
    })

    const ss: Subscription = new Subscription({
      requestManager: rm,
      subscriptionName: 'type',
      paramsNum: 0
    })

    ss.on('error', onError)

    ss.subscribe(callback)

    expect(onError).toHaveBeenCalled()
    expect(onError.mock.calls[0][0]).toEqual(new Error('error'))

    expect(callback).toHaveBeenCalled()
    expect(callback.mock.calls[0][0]).toEqual(new Error('error'))
  })

  it('subscribe, formatInput', () => {
    const onData = jest.fn()
    const callback = jest.fn()
    const rm = new RequestManager('ws://localhost:10000')
    rm.send = jest.fn().mockImplementation((payload, cb) => {
      expect(payload).toEqual({
        method: 'dipperin_subscribe',
        params: ['type', 2]
      })
      cb(null, 1)
    })

    rm.addSubscription = jest.fn().mockImplementation((_, __, ___, cb) => {
      cb(null, 'test')
    })

    const ss: Subscription = new Subscription({
      requestManager: rm,
      subscriptionName: 'type',
      paramsNum: 1,
      inputFormatter: [p => p + 1]
    })

    ss.on('data', onData)

    ss.subscribe(1, callback)

    expect(onData).toHaveBeenCalled()
    expect(onData.mock.calls[0][0]).toEqual('test')

    expect(callback).toHaveBeenCalled()
    expect(callback.mock.calls[0][1]).toEqual('test')
  })

  it('subscribe, formatOutput', () => {
    const onData = jest.fn()
    const callback = jest.fn()
    const rm = new RequestManager('ws://localhost:10000')
    rm.send = jest.fn().mockImplementation((_, cb) => {
      cb(null, 1)
    })

    rm.addSubscription = jest.fn().mockImplementation((_, __, ___, cb) => {
      cb(null, 'test')
    })

    const ss: Subscription = new Subscription({
      requestManager: rm,
      subscriptionName: 'type',
      paramsNum: 1,
      outputFormatter: res => res + 's'
    })

    ss.on('data', onData)

    ss.subscribe(1, callback)

    expect(onData).toHaveBeenCalled()
    expect(onData.mock.calls[0][0]).toEqual('tests')

    expect(callback).toHaveBeenCalled()
    expect(callback.mock.calls[0][1]).toEqual('tests')
  })

  it('subscribe, Already have subscription', () => {
    const rm = new RequestManager('ws://localhost:10000')
    rm.send = jest.fn().mockImplementation((_, cb) => {
      cb(null, 1)
    })

    rm.addSubscription = jest.fn().mockImplementation((_, __, ___, cb) => {
      cb(null, 'test')
    })

    const ss: Subscription = new Subscription({
      requestManager: rm,
      subscriptionName: 'type',
      paramsNum: 0
    })

    const mockUnsubscribe = jest.spyOn(ss, 'unsubscribe')

    ss.subscribe()

    ss.subscribe()

    expect(mockUnsubscribe).toHaveBeenCalled()
  })
})
