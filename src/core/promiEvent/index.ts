import EventEmitter from 'eventemitter3'

export class PromiseWithEvent {
  resolve: any
  reject: any
  eventEmitter
  constructor(justPromise?: boolean) {
    this.eventEmitter = new Promise((...args) => {
      this.resolve = args[0]
      this.reject = args[1]
    })
    if (justPromise) {
      return
    }
    const eventEmitter = new EventEmitter()

    this.eventEmitter['_events'] = eventEmitter['_events']
    this.eventEmitter.emit = eventEmitter.emit
    this.eventEmitter.on = eventEmitter.on
    this.eventEmitter.once = eventEmitter.once
    this.eventEmitter.off = eventEmitter.off
    this.eventEmitter.listeners = eventEmitter.listeners
    this.eventEmitter.addListener = eventEmitter.addListener
    this.eventEmitter.removeListener = eventEmitter.removeListener
    this.eventEmitter.removeAllListeners = eventEmitter.removeAllListeners
  }
}

export type PromiEventInterface = { resolve?: (value: any) => any } & ((
  justPromise?: boolean
) => PromiseWithEvent)

const PromiEvent: PromiEventInterface = (justPromise?: boolean) => {
  return new PromiseWithEvent(justPromise)
}

PromiEvent.resolve = value => {
  const promise = PromiEvent(true)
  promise.resolve(value)
  return promise.eventEmitter
}

export default PromiEvent
