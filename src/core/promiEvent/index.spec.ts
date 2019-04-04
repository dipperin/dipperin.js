import PromiEvent from './index'

test('core/promiEvent', () => {
  const promiEvent = PromiEvent()
  setImmediate(() => {
    promiEvent.resolve('hello')
  })
  return promiEvent.eventEmitter.then(res => {
    expect(res).toBe('hello')
  })
})
