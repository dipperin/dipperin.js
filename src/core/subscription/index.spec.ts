import RequestManager from '../requestManager'
import Subscription from './index'

describe('subscription', () => {
  it('constructor', () => {
    expect(() => {
      const rm = new RequestManager()
      const subscription = new Subscription({
        requestManager: rm,
        subscriptionName: 'type'
      })
      return subscription
    }).not.toThrow()
  })
})
