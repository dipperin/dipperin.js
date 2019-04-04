import _ from 'lodash'
import Core from '../core'
import { Provider, Callback } from '../providers'
// add some method about node
class Net extends Core {
  constructor(provider: Provider | string) {
    super(provider)
  }

  getConnecting: (cb?: Callback) => Promise<boolean> = this.buildCall({
    call: 'dipperin_currentBlock',
    name: 'getConnecting',
    params: 0
  })

  isConnecting = async (cb?: any): Promise<boolean> => {
    try {
      await this.getConnecting()
      if (_.isFunction(cb)) {
        cb(true)
      }
      return true
    } catch (__) {
      if (_.isFunction(cb)) {
        cb(false)
      }
      return false
    }
  }
}

export default Net
