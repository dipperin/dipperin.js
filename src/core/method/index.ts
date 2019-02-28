import { isFunction, isArray } from 'lodash'
import Helper from '../../helper'
import Utils from '../../utils'
import PromiEvent, { Promisify } from '../promiEvent'
import RequestManager from '../requestManager'
import { Callback } from '../../providers'

type Formatter = (...args: any[]) => any

export interface PayloadObject {
  callback: Callback
  method: string
  params: any[]
}

export interface MethodOptions {
  name: string
  call: string
  params?: number
  inputFormatter?: Formatter[]
  outputFormatter?: Formatter
  transformPayload?: Formatter
  requestManager?: RequestManager
}

function Method(options: MethodOptions): (...args: any[]) => any {
  if (!options.call || !options.name) {
    throw new Helper.Errors.InvalidMethodParamsError()
  }

  options.params = options.params || 0
  return (...args: any[]) => {
    const defer = PromiEvent()
    const payload = toPayload(
      options.transformPayload,
      options.inputFormatter,
      options.params,
      options.name,
      options.call,
      args
    )

    const sendCallback = buildSendCallback(
      options.outputFormatter,
      payload,
      defer
    )

    if (!(options.requestManager instanceof RequestManager)) {
      throw new Helper.Errors.InvalidRequestManagerError()
    }

    options.requestManager.send(payload, sendCallback)

    return defer.eventEmitter
  }
}

export function buildSendCallback(
  outputFormatter: Formatter,
  payload: PayloadObject,
  defer: Promisify
): Callback {
  return (error, result: any) => {
    let err = error
    let res = result

    try {
      res = formatOutput(outputFormatter, result)
    } catch (e) {
      err = e
    }

    if (res instanceof Error) {
      err = res
    }

    if (!err) {
      if (payload.callback) {
        payload.callback(null, res)
      }
    } else {
      Utils.fireError(err, defer.reject, payload.callback)
    }

    if (!err) {
      defer.resolve(res)
    }
  }
}

export function toPayload(
  transformPayload: Formatter,
  inputFormatter: Formatter[],
  paramsNum: number,
  name: string,
  call: string,
  args: any[]
): PayloadObject {
  const callback = extractCallback(args)
  const params = formatInput(inputFormatter, args)
  validateArgs(params, paramsNum, name)
  let payload = {
    callback,
    method: call,
    params
  }
  if (transformPayload) {
    payload = transformPayload(payload)
  }

  return payload
}

/**
 * Should be used to extract callback from array of arguments.
 *
 * @param args
 * @return callback, if exists
 */
export function extractCallback(args: any[]): any {
  return isFunction(args[args.length - 1]) ? args.pop() : undefined
}

/**
 * Should be called to format output(result) of method
 *
 * @param result
 */
export function formatOutput(outputFormatter: Formatter, result: any): any {
  if (!isFunction(outputFormatter)) {
    return result
  }
  if (isArray(result)) {
    return result.map(res => {
      return res ? outputFormatter(res) : res
    })
  } else {
    return result ? outputFormatter(result) : result
  }
}

/**
 * Should be called to format input args of method
 *
 * @param args
 */
export function formatInput(inputFormatter: Formatter[], args: any[]): any[] {
  if (!isArray(inputFormatter)) {
    return args
  }

  return inputFormatter.map((formatter, index) => {
    return isFunction(formatter) ? formatter(args[index]) : args[index]
  })
}

/**
 * Should be called to check if the number of arguments is correct
 *
 * @param args
 */
export function validateArgs(args: any[], params: number, name: string): void {
  if (args.length !== params) {
    throw new Helper.Errors.InvalidNumberOfParamsError(
      args.length,
      params,
      name
    )
  }
}

export default Method
