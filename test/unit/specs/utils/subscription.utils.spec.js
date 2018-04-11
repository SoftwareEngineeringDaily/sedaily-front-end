import * as utils from 'utils/subscription.utils'

describe('subscription.utils', () => {
  it('should retrieve planType from storage', () => {
    const stub = sinon.stub(window.localStorage, 'getItem').returns('foo')
    const planType = utils.preSelectedSubscriptionPlan()

    expect(planType).to.not.be.an('undefined')
    stub.restore()
  })

  it('should store planType in storage', () => {
    const spy = sinon.spy(window.localStorage, 'setItem')

    utils.selectSubscriptionPlan('bar')

    expect(spy.calledWith('bar'))
    spy.restore()
  })

  it('should clear planType from storage', () => {
    const spy = sinon.spy(window.localStorage, 'setItem')

    utils.unselectSubscriptionPlan()

    expect(spy.calledWith(null))
    spy.restore()
  })

  it('should indicate wantedToSubscribe when planType populated', () => {
    const stub = sinon.stub(window.localStorage, 'getItem').returns('foo')
    const wanted = utils.wantedToSubscribe()

    expect(wanted).to.equal(true)
    stub.restore()
  })

  it('should indicate not wantedToSubscribe when planType null', () => {
    const stub = sinon.stub(window.localStorage, 'getItem').returns(null)
    const wanted = utils.wantedToSubscribe()

    expect(wanted).to.not.equal(true)
    stub.restore()
  })
})
