import EventEmitter from 'eventemitter3'
import { isArray, isFunction, noop } from 'lodash'
import Helper from '../../helper'
import RequestManager from '../requestManager'
import { Callback } from '../../providers'

type Formatter = (...args: any[]) => any

export interface SubscriptionOptions {
  subscriptionName: string
  requestManager?: RequestManager
  inputFormatter?: Formatter[]
  outputFormatter?: Formatter
  paramsNum?: number
}

class Subscription extends EventEmitter {
  id: string
  callback: (...args: any[]) => any
  options: SubscriptionOptions
  subscriptionMethod: string

  constructor(options: SubscriptionOptions) {
    super()

    this.id = null
    this.callback = noop
    this.options = options
  }

  unsubscribe(callback?: any): void {
    this.options.requestManager.removeSubscription(this.id, callback)
    this.id = null
    this.removeAllListeners()
  }

  subscribe(...args: any[]): Subscription {
    const payload = this.toPayload(args)

    if (!this.checkEnv()) {
      return this
    }

    // if id is there unsubscribe first
    if (this.id) {
      this.unsubscribe()
    }

    // create subscription

    this.options.requestManager.send(payload, (err, result: string) => {
      if (!err && result) {
        this.id = result

        // call callback on notifications
        this.options.requestManager.addSubscription(
          this.id,
          payload.params[0],
          payload.params[0],
          this.buildSubscriptionCallback()
        )
      } else if (isFunction(this.callback)) {
        this.callback(err, null, this)
        this.emit('error', err)
      } else {
        // emit the event even if no callback was provided
        this.emit('error', err)
      }
    })

    // return an object to cancel the subscription
    return this
  }

  private buildSubscriptionCallback(): Callback {
    return (err, res) => {
      let result = res
      if (!err) {
        if (!isArray(result)) {
          result = [result]
        }

        result.forEach((resultItem: any) => {
          const output = this.formatOutput(
            resultItem,
            this.options.outputFormatter
          )

          this.emit('data', output)

          // call the callback, last so that unsubscribe there won't affect the emit above
          if (isFunction(this.callback)) {
            this.callback(null, output, this)
          }
        })
      } else {
        // unsubscribe, but keep listeners
        this.options.requestManager.removeSubscription(this.id)

        this.emit('error', err)

        // call the callback, last so that unsubscribe there won't affect the emit above
        if (isFunction(this.callback)) {
          this.callback(err, null, this)
        }
      }
    }
  }

  private checkEnv(): boolean {
    const callback = isFunction(this.callback) ? this.callback : noop
    if (!this.options.requestManager.provider) {
      const err = new Helper.Errors.InvalidProviderError()
      callback(err, null, this)
      this.emit('error', err)
      return false
    }

    // throw error, if provider doesnt support subscriptions
    if (!this.options.requestManager.provider.on) {
      const err = new Helper.Errors.UnsupportedSubscriptionsProviderError(
        this.options.requestManager.provider.constructor.name
      )
      callback(err, null, this)
      this.emit('error', err)
      return false
    }

    return true
  }

  private extractCallback(args: any[]): any {
    return isFunction(args[args.length - 1]) ? args.pop() : undefined
  }

  private validateArgs(args: any[]): void {
    if (!this.options.paramsNum) {
      this.options.paramsNum = 0
    }

    if (args.length !== this.options.paramsNum) {
      throw new Helper.Errors.InvalidNumberOfParamsError(
        args.length,
        this.options.paramsNum,
        args[0]
      )
    }
  }

  private formatInput(args: any[], inputFormatter?: Formatter[]): any[] {
    if (!inputFormatter) {
      return args
    }

    const formattedArgs = inputFormatter.map((formatter, index) => {
      return formatter ? formatter(args[index]) : args[index]
    })

    return formattedArgs
  }

  private formatOutput(result: any, outputFormatter?: Formatter): any {
    return outputFormatter && result ? outputFormatter(result) : result
  }

  private toPayload(args: any[]): PayloadObject {
    let params = []
    let thatArgs = args
    this.callback = this.extractCallback(thatArgs)
    thatArgs = this.formatInput(thatArgs, this.options.inputFormatter)

    this.validateArgs(thatArgs)

    // re-add subscriptionName
    params.push(this.options.subscriptionName)
    params = params.concat(thatArgs)

    return {
      method: 'chainstack_subscribe',
      params
    }
  }
}

export default Subscription

export interface PayloadObject {
  method: string
  params: any[]
}
