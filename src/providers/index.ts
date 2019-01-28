export { default as HttpProvider } from './httpProvider'
export { default as IpcProvider } from './ipcProvider'
export { default as WebsocketProvider } from './wsProvider'
import HttpProvider from './httpProvider'
import IpcProvider from './ipcProvider'
import WebsocketProvider from './wsProvider'

export interface Payload {
  jsonrpc?: string
  id?: string | number
  method: string
  params: any[]
}

export interface Callback {
  (err?: Error, res?: any): void
  method?: string
}

export interface Provider {
  send: (
    payload: Payload | Payload[],
    callback: Callback
  ) => Promise<void> | void
  on?: (type: string, callback: Callback) => void
  once?: (type: string, callback: Callback) => void
  reconnect?: () => void
  reset?: () => void
}

export default {
  HttpProvider,
  IpcProvider,
  WebsocketProvider
}
