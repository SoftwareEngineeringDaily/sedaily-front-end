import { secondToTime } from 'utils/time.utils'

describe('time.utils', () => {
  it('should handle NaN', () => {
    const time = secondToTime(NaN)
    expect(time).to.equal('00:00')
  })

  it('should handle seconds', () => {
    const time = secondToTime(19)
    expect(time).to.equal('00:19')
  })

  it('should handle minutes', () => {
    const time = secondToTime(3023)
    expect(time).to.equal('50:23')
  })

  it('should handle hours', () => {
    const time = secondToTime(7337)
    expect(time).to.equal('02:02:17')
  })
})
