import RequestManager from '../requestManager'
import Subscription from './index'

describe('subscription', () => {
  let ss: Subscription

  it('constructor', () => {
    expect(() => {
      const rm = new RequestManager()
      ss = new Subscription({
        requestManager: rm,
        subscriptionName: 'type'
      })
      return ss
    }).not.toThrow()
  })
})
