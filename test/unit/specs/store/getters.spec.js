import getters from 'store/getters'
import Vuex from 'vuex'

describe('store.getters', () => {
  it('returns token from store', () => {
    const store = new Vuex.Store({ state: { token: 'foo' }, getters })
    const token = store.getters.getToken

    expect(token).to.equal('foo')
  })

  it('detects user is logged in', () => {
    const store = new Vuex.Store({ state: { token: 'foo' }, getters })
    const loggedIn = store.getters.isLoggedIn

    expect(loggedIn).to.equal(true)
  })

  it('detects user is not logged in', () => {
    const store = new Vuex.Store({ state: { token: undefined }, getters })
    const loggedIn = store.getters.isLoggedIn

    expect(loggedIn).to.not.equal(true)
  })
})
