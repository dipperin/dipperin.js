import Helper from '../../helper'
import RequestManager from '../requestManager'
import Method, {
  extractCallback,
  formatInput,
  formatOutput,
  validateArgs,
  toPayload
} from './index'

test('core/method/constructor', () => {
  expect(() => {
    const method = Method({
      call: 'call',
      name: ''
    })
    return method
  }).toThrowError(Helper.Errors.InvalidMethodParamsError)
})

test('core/method/extractCallback', () => {
  const noop = () => null
  const args = ['arg', noop]
  expect(extractCallback(args)).toBe(noop)
  expect(extractCallback(args)).toBe(undefined)
})

test('core/method/formatInput', () => {
  expect(formatInput(undefined, [])).toEqual([])
  expect(formatInput([() => 2, () => 2], [1, 2])).toEqual([2, 2])
})

test('core/method/formatOutput', () => {
  expect(formatOutput(undefined, [])).toEqual([])

  const outputFormatter = val => val + 2

  expect(formatOutput(outputFormatter, 2)).toEqual(4)
  expect(formatOutput(outputFormatter, [1, 2])).toEqual([3, 4])
})

test('core/method/validateArgs', () => {
  expect(() => {
    validateArgs([], 2, 'test')
  }).toThrowError(Helper.Errors.InvalidNumberOfParamsError)

  expect(() => {
    validateArgs([1, 2, 3], 3, 'test')
  }).not.toThrow()
})

test('core/method/toPayload', () => {
  expect(toPayload(undefined, undefined, 3, 'test', 'test', [1, 2, 3])).toEqual(
    {
      callback: undefined,
      method: 'test',
      params: [1, 2, 3]
    }
  )

  const transformPayload = payload => {
    payload.params.reverse()
    return payload
  }

  expect(
    toPayload(transformPayload, undefined, 3, 'test', 'test', [1, 2, 3])
  ).toEqual({
    callback: undefined,
    method: 'test',
    params: [3, 2, 1]
  })
})

test('core/method/buildCall', async () => {
  expect.assertions(1)
  const rm = new RequestManager('http://localhost:8888')
  rm.send = (_, callback) => {
    callback(null, {})
  }
  const method = Method({
    call: 'call',
    name: 'name',
    requestManager: rm
  })

  const obj = {
    test: method
  }

  const res = await obj.test()
  expect(res).toEqual({})
})
