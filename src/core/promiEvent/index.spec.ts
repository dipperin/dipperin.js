import PromiEvent from './index'

test('core/promiEvent', () => {
  const promiEvent = PromiEvent(false)
  setImmediate(() => {
    promiEvent.eventEmitter.emit('done', 'hello')
    promiEvent.resolve('hello')
  })
  return promiEvent.eventEmitter
    .on('done', res => {
      expect(res).toBe('hello')
    })
    .then(res => {
      expect(res).toBe('hello')
    })
})
