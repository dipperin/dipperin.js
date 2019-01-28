import axios, { AxiosInstance } from 'axios'
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
      let err = error
      switch (error.status) {
        case 404:
          this.connected = false
          err = new Helper.Errors.InvalidConnectionError(this.host)
          break
        case 500:
          err = new Helper.Errors.ResponseError(error.data.error)
          break
        case 400:
          err = new Helper.Errors.ResponseError(error.data.error)
          break
        default:
          this.connected = false
          err = new Helper.Errors.InvalidConnectionError(this.host)
          break
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
    if (Array.isArray(this.headers)) {
      this.headers.forEach((header: HeaderConfig) => {
        headers[header.name] = header.value
      })
    }
    return axios.create({
      baseURL: this.host,
      headers,
      method: 'post',
      timeout: this.timeout
    })
  }
}

export default HttpProvider
