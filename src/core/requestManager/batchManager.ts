import { isFunction, isNil } from 'lodash'
import Helper from '../../helper'
import RequestManager from './index'
import { Callback, Payload } from '../../providers'
import JsonRpc from './jsonRpc'

interface Request extends Payload {
  callback: Callback
  format?: (result: any) => any
}

class BatchManager {
  requestManager: RequestManager
  requests: Request[]

  constructor(requestManager: RequestManager) {
    this.requestManager = requestManager
    this.requests = []
  }

  add = (request: Request) => {
    this.requests.push(request)
  }

  execute = () => {
    this.requestManager.sendBatch(this.requests, (err, results = []) => {
      if (!isNil(err)) {
        throw err
      }
      this.requests
        .map((_, index) => {
          return results[index]
        })
        .forEach((result = {}, index) => {
          const request = this.requests[index]

          if (isFunction(request.callback)) {
            if (result.error) {
              return request.callback(new Helper.Errors.ResponseError(result))
            }

            if (!JsonRpc.isValidResponse(result)) {
              return request.callback(
                new Helper.Errors.InvalidResponseError(result)
              )
            }

            request.callback(
              null,
              isFunction(request.format)
                ? request.format(result.result)
                : result.result
            )
          }
        })
    })
  }
}

export default BatchManager
