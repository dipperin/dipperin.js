import { isNil, isFunction, isString, isArray } from 'lodash'
import { Provider, Payload, Callback } from './index'
import ws from 'isomorphic-ws'
import Helper from '../helper'
import Utils from '../utils'

interface Options {
  headers?: HeaderConfig[]
  timeout?: number
}

export interface HeaderConfig {
  name: string
  value: string
}

interface Response {
  id: string
  method: string
}

type NotificationCallback = (res?: any) => void

interface ResponseCallbacks {
  [propName: string]: Callback
}

class WebsocketProvider implements Provider {
  url: string // websocket url
  responseCallbacks: ResponseCallbacks // response callback map
  notificationCallbacks: NotificationCallback[] // notification callback array
  connection: ws // websocket connection
  lastChunk: string // the last chunk
  lastChunkTimeout: any // the last chunk timeout
  customTimeout: number // custom timeout

  constructor(url: string, options?: Options) {
    this.responseCallbacks = {}
    this.notificationCallbacks = []
    const thatOptions = isNil(options) ? {} : options
    this.customTimeout = thatOptions.timeout

    this.url = url
    this.connection = new ws(url)
    this.addDefaultEvents()
    this.connection.onmessage = this.onMessage
  }

  isConnect(): boolean {
    return this.connection.readyState === this.connection.OPEN
  }

  /**
   * Send request
   *
   * @param payload
   * @param callback
   */
  send(payload: Payload | Payload[], callback: Callback): void {
    if (this.connection.readyState === this.connection.CONNECTING) {
      setTimeout(() => {
        this.send(payload, callback)
      }, 10)
      return
    }
    if (!this.isConnect()) {
      if (isFunction(this.connection.onerror)) {
        this.connection.onerror(
          new Helper.Errors.InvalidConnectionError(this.url)
        )
      }
      callback(new Helper.Errors.InvalidConnectionError(this.url))
      return
    }
    this.connection.send(JSON.stringify(payload))
    this.addResponseCallback(payload, callback)
  }

  /**
   * Listen for specified events
   * @param type
   * @param callback
   */
  on(type: string, callback: Callback): void {
    if (!isFunction(callback)) {
      throw new Helper.Errors.InvalidCallbackError()
    }

    switch (type) {
      case 'data':
        this.notificationCallbacks.push(callback)
        break
      case 'connect':
        this.connection.onopen = () => {
          callback()
        }
        break

      case 'end':
        this.connection.onclose = () => {
          callback()
        }
        break

      case 'error':
        this.connection.onerror = () => {
          callback()
        }
        break
    }
  }

  /**
   * Remove the specified listening event
   *
   * @param type
   * @param callback
   */
  removeListener(type: string, callback): void {
    switch (type) {
      case 'data':
        this.notificationCallbacks = this.notificationCallbacks.filter(
          cb => cb === callback
        )
        break
    }
  }

  /**
   * Remove all listening event
   *
   * @param type
   */
  removeAllListeners(type: string): void {
    switch (type) {
      case 'data':
        this.notificationCallbacks = []
        break
      case 'connect':
        this.connection.onopen = null
        break
      case 'end':
        this.connection.onclose = null
        break
      case 'error':
        this.connection.onerror = null
        break
      default:
        break
    }
  }

  /**
   * Resets the providers, clears all callbacks
   */
  reset(): void {
    this.timeout()
    this.notificationCallbacks = []

    // this.connection.removeAllListeners('error');
    // this.connection.removeAllListeners('end');
    // this.connection.removeAllListeners('timeout');

    this.addDefaultEvents()
  }

  /**
   *  Will add the error and end event to timeout existing calls
   */
  private addDefaultEvents(): void {
    this.connection.onerror = () => {
      this.timeout()
    }

    this.connection.onclose = () => {
      this.timeout()

      this.reset()
    }
  }

  /**
   * Listen for connection response
   *
   * @param e
   */
  private onMessage = (e): void => {
    const data: string = isString(e.data) ? e.data : ''

    this.parseResponse(data).forEach(result => {
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
      // notification
      if (
        isNil(id) &&
        !isArray(result) &&
        result.method &&
        result.method.includes('_subscription')
      ) {
        this.notificationCallbacks.forEach(callback => {
          if (isFunction(callback)) {
            callback(result)
          }
        })
      } else if (this.responseCallbacks[id]) {
        this.responseCallbacks[id](null, result)
        delete this.responseCallbacks[id]
      }
    })
  }

  /**
   * Timeout all requests when the end/error event is fired
   */
  private timeout(): void {
    for (const key in this.responseCallbacks) {
      if (this.responseCallbacks.hasOwnProperty(key)) {
        this.responseCallbacks[key](
          new Helper.Errors.InvalidConnectionError('on WS')
        )
        delete this.responseCallbacks[key]
      }
    }
  }

  /**
   * Will parse the response and make an array out of it.
   *
   * @param data
   */
  private parseResponse(data: string): Array<Response | Response[]> {
    // DE-CHUNKER
    const dechunkedData = Utils.dechunk(data).split('|--|')
    const returnValues = dechunkedData
      .map(dataItem => {
        const thatData = this.lastChunk ? this.lastChunk + dataItem : dataItem

        let result: Response = null

        try {
          result = JSON.parse(thatData)
        } catch (e) {
          this.lastChunk = thatData
          clearTimeout(this.lastChunkTimeout)
          this.lastChunkTimeout = setTimeout(() => {
            this.timeout()
            throw new Helper.Errors.InvalidResponseError(thatData)
          }, 1000 * 15)
          return null
        }

        clearTimeout(this.lastChunkTimeout)
        this.lastChunk = null
        return result
      })
      .filter(dataItem => !isNil(dataItem))
    return returnValues
  }

  /**
   * Get the adds a callback to the responseCallbacks object
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

    // schedule triggering the error response if a custom timeout is set
    if (this.customTimeout) {
      setTimeout(() => {
        if (this.responseCallbacks[id]) {
          this.responseCallbacks[id](
            new Helper.Errors.ConnectionTimeoutError(
              this.customTimeout.toString()
            )
          )
          delete this.responseCallbacks[id]
        }
      }, this.customTimeout)
    }
  }
}

export default WebsocketProvider
