import HttpProvider from '../providers/httpProvider'
import DR from './index'

describe('cs', () => {
  it('constructor', () => {
    expect(() => {
      const provider = new HttpProvider('http://localhost:6666')
      const cs = new DR(provider)
      return cs
    }).not.toThrow()
  })

  it('setProvider', () => {
    const provider = new HttpProvider('http://localhost:7777')
    const provider2 = new HttpProvider('http://localhost:8888')
    const cs = new DR(provider)
    cs.setProvider(provider2)
    expect(cs.provider).toEqual(provider2)
  })
})
