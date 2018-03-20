import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Router from 'vue-router'
import App from '@/App.vue'
import initialState from '@/store/initialState'

describe('App.vue', (done) => {
  const localVue = createLocalVue()

  localVue.use(Vuex)
  localVue.use(Router)

  let sandbox
  let router

  const store = {
    state: initialState,
    getters: {
      isLoggedIn () { return false }
    }
  }

  beforeEach(() => {
    sandbox = sinon.sandbox.create()

    router = new Router()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('player should be inactive when no activePlayerPost', () => {
    const testStore = new Vuex.Store({
      ...store,
      state: {
        activePlayerPost: null
      }
    })

    const wrapper = mount(App, {
      localVue,
      store: testStore,
      router
    })

    expect(wrapper.vm.isPlayerActive).to.equal(false)
    expect(wrapper.find('.player-holder').element).to.be.an('undefined')
  })

  it('player should be inactive when activePlayerPost has no associated mp3', () => {
    const testStore = new Vuex.Store({
      ...store,
      state: {
        activePlayerPost: {
          mp3: null
        }
      }
    })

    const wrapper = mount(App, {
      localVue,
      store: testStore,
      router
    })

    expect(wrapper.vm.isPlayerActive).to.equal(false)
    expect(wrapper.find('.player-holder').element).to.be.an('undefined')
  })

  it('player should be active when activePlayerPost has associated mp3', () => {
    const testStore = new Vuex.Store({
      ...store,
      state: {
        activePlayerPost: {
          mp3: 'foo',
          title: {
            rendered: 'hello'
          }
        }
      }
    })

    const wrapper = mount(App, {
      localVue,
      store: testStore,
      router
    })

    expect(wrapper.vm.isPlayerActive).to.equal(true)
    expect(wrapper.find('.player-holder').element.style.display).to.not.equal('none')
  })

  it('should show beta message when on home page', () => {
    router.replace('/')

    const wrapper = mount(App, {
      localVue,
      store,
      router
    })

    expect(wrapper.vm.showBeta).to.equal(true)
    expect(wrapper.find('.beta-msg').exists()).to.equal(true)
  })

  it('should hide beta message when not on home page', () => {
    router.replace('/foo')

    const wrapper = mount(App, {
      localVue,
      store,
      router
    })

    expect(wrapper.vm.showBeta).to.equal(false)
    expect(wrapper.find('.beta-msg').exists()).to.equal(false)
  })
})
