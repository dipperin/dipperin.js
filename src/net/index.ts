import _ from 'lodash'
import Core from '../core'
import { Provider, Callback } from '../providers'
import { Socket } from 'net'
// add some method about node
class Net extends Core {
  constructor(provider: Provider | string, net?: Socket) {
    super(provider, net)
  }
  getConnecting: (cb?: Callback) => Promise<boolean> = this.buildCall({
    call: 'chainstack_currentBlock',
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
        cb(true)
      }
      return false
    }
  }
}

export default Net
