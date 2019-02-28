export class Promisify {
  resolve: any
  reject: any
  eventEmitter: InstanceType<typeof Promise>
  constructor() {
    this.eventEmitter = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }
}

export type PromiEventInterface = {
  resolve?: (value: any) => any
} & (() => Promisify)

const PromiEvent: PromiEventInterface = () => {
  return new Promisify()
}

PromiEvent.resolve = value => {
  const promise = PromiEvent()
  promise.resolve(value)
  return promise.eventEmitter
}

export default PromiEvent
