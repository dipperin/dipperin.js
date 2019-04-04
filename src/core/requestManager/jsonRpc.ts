import { isUndefined, isArray } from 'lodash'
import { Payload } from '../../providers'
import Helper from '../../helper'

abstract class JsonRpc {
  static messageId = 0

  static toPayload = (method: string, params: any[]): Payload => {
    if (!method) {
      throw new Helper.Errors.WrongMethodForParams(params)
    }

    JsonRpc.messageId++

    return {
      id: JsonRpc.messageId,
      jsonrpc: '2.0',
      method,
      params: params || []
    }
  }

  static isValidResponse = response => {
    const validateSingleMessage = message => {
      return (
        !!message &&
        !message.error &&
        message.jsonrpc === '2.0' &&
        (typeof message.id === 'number' || typeof message.id === 'string') &&
        !isUndefined(message.result)
      ) // only undefined is not valid json object
    }
    return isArray(response)
      ? response.every(validateSingleMessage)
      : validateSingleMessage(response)
  }

  static toBatchPayload = (messages: Payload[]): Payload[] => {
    return messages.map(message =>
      JsonRpc.toPayload(message.method, message.params)
    )
  }
}

export default JsonRpc
