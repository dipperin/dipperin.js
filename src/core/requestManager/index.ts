import { isNil, isString, isFunction, isArray, noop } from 'lodash'
import Helper from '../../helper'
import {
  HttpProvider,
  Provider,
  WebsocketProvider,
  Callback,
  Payload
} from '../../providers'
import JsonRpc from './jsonRpc'
export { default as BatchManager } from './batchManager'

export interface ProvidersInterface {
  HttpProvider: typeof HttpProvider
  WebsocketProvider: typeof WebsocketProvider
}

type Subscriptions = Map<
  string,
  {
    name: string
    type: string
    callback: Callback
  }
>

class RequestManager {
  static providers: ProvidersInterface = {
    HttpProvider,
    WebsocketProvider
  }
  provider: Provider
  providers: ProvidersInterface
  subscriptions: Subscriptions

  constructor(provider?: string | Provider) {
    this.provider = null
    this.providers = RequestManager.providers
    this.subscriptions = new Map()
    this.setProvider(provider)
  }

  setProvider = (newProvider: string | Provider) => {
    let provider: Provider
    if (isNil(newProvider)) {
      return
    }

    provider = isString(newProvider)
      ? this.getProviderFromPath(newProvider as string)
      : newProvider
    this.provider = provider || null

    // listen to incoming notifications
    if (this.provider && this.provider.on) {
      this.provider.on('data', (result, deprecatedResult) => {
        const thisResult = result || deprecatedResult
        if (
          thisResult.method &&
          this.subscriptions.get(thisResult.params.subscription) &&
          this.subscriptions.get(thisResult.params.subscription).callback
        ) {
          this.subscriptions
            .get(thisResult.params.subscription)
            .callback(null, thisResult.params.result)
        }
      })
    }
  }

  send = (data: Payload, callback?: Callback) => {
    const cb = isFunction(callback) ? callback : noop
    if (!this.provider) {
      return cb(new Helper.Errors.InvalidProviderError())
    }

    const payload = JsonRpc.toPayload(data.method, data.params)

    this.provider.send(payload, (err, result) => {
      if (result && result.id && payload.id !== result.id) {
        return cb(
          new Helper.Errors.WrongResponseIdError(result.id, payload.id, payload)
        )
      }

      if (err) {
        return cb(err)
      }

      if (result && result.error) {
        return cb(new Helper.Errors.ResponseError(result))
      }

      if (!JsonRpc.isValidResponse(result)) {
        return cb(new Helper.Errors.InvalidResponseError(result))
      }

      cb(null, result.result)
    })
  }

  sendBatch = (data: Payload[], callback: Callback) => {
    if (!this.provider) {
      return callback(new Helper.Errors.InvalidProviderError())
    }

    const payload = JsonRpc.toBatchPayload(data)

    this.provider.send(payload, (err, results) => {
      if (err) {
        return callback(err)
      }

      if (!isArray(results)) {
        return callback(new Helper.Errors.InvalidResponseError(results))
      }

      callback(null, results)
    })
  }

  addSubscription(
    id: string,
    name: string,
    type: string,
    callback: Callback
  ): void {
    if (this.provider.on) {
      this.subscriptions.set(id, {
        callback,
        name,
        type
      })
    } else {
      throw new Helper.Errors.UnsupportedSubscriptionsProviderError(
        this.provider.constructor.name
      )
    }
  }

  removeSubscription(id: string, callback?: Callback): void {
    if (this.subscriptions.has(id)) {
      this.send(
        {
          method: `chainstack_unsubscribe`,
          params: [id]
        },
        callback
      )

      // remove subscription
      this.subscriptions.delete(id)
    }
  }

  clearSubscriptions(keepIsSyncing: boolean): void {
    for (const id of this.subscriptions.keys()) {
      if (!keepIsSyncing || this.subscriptions.get(id).name !== 'syncing') {
        this.removeSubscription(id)
      }
    }

    //  reset notification callbacks etc.
    if (this.provider.reset) {
      this.provider.reset()
    }
  }

  private getProviderFromPath = (path: string): Provider => {
    switch (true) {
      case !this.providers:
        return null
      case /^http(s)?:\/\//i.test(path):
        return new this.providers.HttpProvider(path)
      case /^ws(s)?:\/\//i.test(path):
        return new this.providers.WebsocketProvider(path)
      default:
        throw new Helper.Errors.InvalidProviderPathError(path)
    }
  }
}

export default RequestManager
