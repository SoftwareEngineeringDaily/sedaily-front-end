import { mount, shallow, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Router from 'vue-router'
import NavigationBar from 'components/NavigationBar'

describe('NavigationBar.vue', (done) => {
  const localVue = createLocalVue()

  localVue.use(Vuex)
  localVue.use(Router)

  let sandbox
  let actions
  let router

  beforeEach(() => {
    sandbox = sinon.sandbox.create()

    router = new Router()

    actions = {
      fetchMyProfileData: sandbox.stub().returns(false)
    }
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should call logout store action and redirect to home', () => {
    const routerSpy = sinon.spy(router, 'replace')
    const store = new Vuex.Store({
      state: {},
      getters: {
        isLoggedIn: sandbox.stub().returns(false)
      },
      actions
    })

    const wrapper = shallow(NavigationBar, {
      localVue,
      store,
      router
    })

    wrapper.vm.$auth = {
      logout: sinon.stub().returns(false)
    }
    wrapper.vm.logoutHandler()

    expect(wrapper.vm.$auth.logout.calledOnce).to.equal(true)
    expect(routerSpy.withArgs('/').calledOnce).to.equal(true)

    routerSpy.restore()
  })

  it('should show login link when not logged in', () => {
    const store = new Vuex.Store({
      state: {},
      getters: {
        isLoggedIn: sandbox.stub().returns(false)
      },
      actions
    })

    const wrapper = mount(NavigationBar, {
      localVue,
      store,
      router
    })

    expect(wrapper.contains('a[href$="login"]')).to.equal(true)
  })

  it('should hide login link when logged in', () => {
    const store = new Vuex.Store({
      state: {},
      getters: {
        isLoggedIn: sandbox.stub().returns(true)
      },
      actions
    })

    const wrapper = mount(NavigationBar, {
      localVue,
      store,
      router
    })

    expect(wrapper.contains('a[href$="login"]')).to.equal(false)
  })
})
