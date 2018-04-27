import filters from '@/filters'

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

describe('filters.externalUrl', () => {
  it('should identify an external url', () => {
    const external = filters.externalUrl('http://www.google.com')
    expect(external).to.equal('http://www.google.com')
  })

  it('should identify an internal url', () => {
    const external = filters.externalUrl('recommendations')
    expect(external).to.equal('//recommendations')
  })
})

describe('filters.decodeString', () => {
  it('should reflect back a non-encoded string', () => {
    const decoded = filters.decodeString('lorem ipsum')
    expect(decoded).to.equal('lorem ipsum')
  })

  it('should decode an encoded string', () => {
    const decoded = filters.decodeString('<h1>lorem ipsum</h1>')
    expect(decoded).to.equal('lorem ipsum')
  })
})
