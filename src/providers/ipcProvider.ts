import { isFunction, isArray, isNil } from 'lodash'
import oboe from 'oboe'
import { Provider, Payload, Callback } from './index'
import Helper from '../helper'
import Utils from '../utils'
import { Socket } from 'net'

interface ResponseCallbacks {
  [id: string]: Callback
}

interface Response {
  id: string
  method: string
}

type NotificationCallback = (res?: any) => void

class IpcProvider implements Provider {
  responseCallbacks: ResponseCallbacks // response callback map
  notificationCallbacks: NotificationCallback[] // notification callback array
  path: string // ipc path
  connection: Socket // ipc connection
  lastChunk: any // the last chunk
  lastChunkTimeout: any // the last chunk timeout

  constructor(path: string, net: Socket) {
    this.responseCallbacks = {}
    this.notificationCallbacks = []
    this.path = path
    this.connection = net.connect({ path: this.path })

    this.addDefaultEvents()

    if (net.constructor.name === 'Socket') {
      oboe(this.connection).done(this.callback)
    } else {
      this.connection.on('data', data => {
        this.parseResponse(data.toString()).forEach(this.callback)
      })
    }
  }

  /**
   * Reconnect the connection
   */
  reconnect(): void {
    this.connection.connect({ path: this.path })
  }

  /**
   * Listen for specified events
   * @param type
   * @param callback
   */
  on(type: string, callback: Callback): void {
    if (isFunction(callback)) {
      switch (type) {
        case 'data':
          this.notificationCallbacks.push(callback)
          break
        default:
          this.connection.on(type, callback)
      }
    } else {
      throw new Helper.Errors.InvalidCallbackError()
    }
  }

  /**
   * Send request to connected server
   * @param payload
   * @param callback
   */
  send(payload: Payload, callback: Callback): void {
    if (!this.connection.writable) {
      this.reconnect()
    }

    this.connection.write(JSON.stringify(payload))
    this.addResponseCallback(payload, callback)
  }

  /**
   * Listen for specified events once
   *
   * @param type
   * @param callback
   */
  once(type: string, callback: Callback): void {
    if (isFunction(callback)) {
      this.connection.once(type, callback)
    } else {
      throw new Helper.Errors.InvalidCallbackError()
    }
  }

  /**
   * Remove the specified listening event
   * @param type
   * @param callback
   */
  removeListener(type: string, callback: Callback): void {
    switch (type) {
      case 'data':
        this.notificationCallbacks = this.notificationCallbacks.filter(
          cb => cb === callback
        )
        break
      default:
        this.connection.removeListener(type, callback)
        break
    }
  }

  /**
   * Remove all listening event
   * @param type
   */
  removeAllListeners(type: string): void {
    switch (type) {
      case 'data':
        this.notificationCallbacks = []
        break
      default:
        this.connection.removeAllListeners(type)
    }
  }

  /**
   * Reset the connection
   */
  reset(): void {
    this.timeout()
    this.notificationCallbacks = []

    this.connection.removeAllListeners('error')
    this.connection.removeAllListeners('end')
    this.connection.removeAllListeners('timeout')

    this.addDefaultEvents()
  }

  /**
   * Handling timeout events
   */
  private timeout(): void {
    for (const key in this.responseCallbacks) {
      if (this.responseCallbacks.hasOwnProperty(key)) {
        this.responseCallbacks[key](
          new Helper.Errors.InvalidConnectionError('on IPC')
        )
        delete this.responseCallbacks[key]
      }
    }
  }

  /**
   * Handling response
   *
   * @param result
   */
  private callback(result: Response | Response[]): void {
    let id = null

    if (isArray(result)) {
      result.forEach(load => {
        if (this.responseCallbacks[load.id]) {
          id = load.id
        }
      })
    } else {
      id = result.id
    }

    if (!id && !isArray(result) && result.method.includes('_subscription')) {
      this.notificationCallbacks.forEach(callback => {
        if (isFunction(callback)) {
          callback(result)
        }
      })
    } else if (this.responseCallbacks[id]) {
      this.responseCallbacks[id](null, result)
      delete this.responseCallbacks[id]
    }
  }

  /**
   * add default events
   */
  private addDefaultEvents(): void {
    ;['error', 'end', 'timeout'].forEach((status: string) => {
      this.connection.on(status, () => {
        this.timeout()
      })
    })
  }

  /**
   * Add callback to response
   *
   * @param payload
   * @param callback
   */
  private addResponseCallback(
    payload: Payload | Payload[],
    callback: Callback
  ): void {
    const id = isArray(payload) ? payload[0].id : payload.id
    const method = isArray(payload) ? payload[0].method : payload.method

    this.responseCallbacks[id] = callback
    this.responseCallbacks[id].method = method
  }

  /**
   * Parse the response
   *
   * @param data response
   */
  private parseResponse(data: string): Array<Response | Response[]> {
    // DE-CHUNKER
    const dechunkedData = Utils.dechunk(data).split('|--|')

    const returnValues = dechunkedData
      .map(dataItem => {
        const thatData = this.lastChunk ? this.lastChunk + dataItem : dataItem

        let result = null

        try {
          result = JSON.parse(thatData)
        } catch (e) {
          this.lastChunk = thatData
          clearTimeout(this.lastChunkTimeout)
          this.lastChunkTimeout = setTimeout(() => {
            this.timeout()
            throw new Helper.Errors.InvalidResponseError(thatData)
          }, 1000 * 15)
          return
        }

        // cancel timeout and set chunk to null
        clearTimeout(this.lastChunkTimeout)
        this.lastChunk = null
        return result
      })
      .filter(dataItem => !isNil(dataItem))

    return returnValues
  }
}

export default IpcProvider
