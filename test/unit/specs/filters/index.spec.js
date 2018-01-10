import * as filters from '@/filters'

describe('filters.pluralize', () => {
  it('should pluralize multiple minutes', () => {
    const minutes = filters.pluralize(60, ' minute')
    expect(minutes).to.equal('60 minutes')
  })

  it('should not pluralize one minute', () => {
    const minutes = filters.pluralize(1, ' minute')
    expect(minutes).to.equal('1 minute')
  })
})

describe('filters.timeAgo', () => {
  it('should calculate minutes', () => {
    const testTime = (Date.now() / 1000) - 600
    const ago = filters.timeAgo(testTime)

    expect(ago).to.equal('10 minutes')
  })

  it('should calculate hours', () => {
    const testTime = (Date.now() / 1000) - 36000
    const ago = filters.timeAgo(testTime)

    expect(ago).to.equal('10 hours')
  })

  it('should calculate days', () => {
    const testTime = (Date.now() / 1000) - 864000
    const ago = filters.timeAgo(testTime)

    expect(ago).to.equal('10 days')
  })
})

describe('filters.host', () => {
  it('should remove www prefix', () => {
    const host = filters.host('www.hotmail.com')
    expect(host).to.equal('hotmail.com')
  })

  it('should remove http prefix', () => {
    const host = filters.host('http://www.hotmail.com')
    expect(host).to.equal('hotmail.com')
  })

  it('should remove https prefix', () => {
    const host = filters.host('https://hotmail.com')
    expect(host).to.equal('hotmail.com')
  })
})
