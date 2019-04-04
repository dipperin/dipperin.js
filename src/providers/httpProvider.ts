import axios, { AxiosInstance, AxiosError } from 'axios'
import Helper from '../helper'
import { Provider, Callback } from './index'

/**
 * header config
 */
export interface HeaderConfig {
  name: string
  value: string
}

class HttpProvider implements Provider {
  host: string // host string
  timeout: number // timeout setting
  connected: boolean // connect or not
  headers: HeaderConfig[] // header config

  constructor(host?: string, timeout?: number, headers: HeaderConfig[] = []) {
    this.host = host || 'http://localhost:8545'
    this.timeout = timeout || 0
    this.connected = false
    this.headers = headers
  }

  /**
   * Send a rpc request to rpc server
   *
   * @param payload
   * @param callback
   */
  async send(payload: object, callback: Callback): Promise<void> {
    const request = this.prepareRequest()
    try {
      const res = await request({
        data: payload
      })
      callback(null, res.data)
    } catch (error) {
      const resErr = error as AxiosError
      let err: Error
      if (resErr.response) {
        switch (resErr.response.status) {
          case 404:
            this.connected = false
            err = new Helper.Errors.InvalidConnectionError(this.host)
            break
          case 405:
            this.connected = false
            err = new Helper.Errors.ResponseError(resErr.response.statusText)
            break
          case 500:
            err = new Helper.Errors.ResponseError(resErr.response.data.error)
            break
          case 400:
            err = new Helper.Errors.ResponseError(resErr.response.data.error)
            break
          default:
            this.connected = false
            err = new Helper.Errors.InvalidConnectionError(this.host)
            break
        }
      } else {
        err = new Error(resErr.message)
      }

      callback(err, null)
    }
  }

  /**
   * Perpare a request object
   */
  private prepareRequest(): AxiosInstance {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
    this.headers.forEach((header: HeaderConfig) => {
      headers[header.name] = header.value
    })
    return axios.create({
      baseURL: this.host,
      headers,
      method: 'post',
      timeout: this.timeout
    })
  }
}

export default HttpProvider
