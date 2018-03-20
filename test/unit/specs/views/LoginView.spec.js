import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import LoginView from '@/views/LoginView.vue'
import initialState from '@/store/initialState'
import VeeValidate from 'vee-validate'

describe('LoginView.vue', () => {
  const localVue = createLocalVue()

  localVue.use(Vuex)
  localVue.use(VeeValidate)

  const store = {
    state: initialState,
    getters: {
      isLoggedIn () { return false }
    }
  }

  const wrapper = mount(LoginView, {
    localVue,
    store: new Vuex.Store({
      ...store
    })
  })

  it('adds a $validator to the Vue instance', () => {
    expect(wrapper.vm).to.have.property('$validator')
  })

  it('injects an error data object into the Vue instance', () => {
    expect(wrapper.vm.errors).to.not.be.an('undefined')
    expect(wrapper.vm.errors.all().length).to.equal(0)
  })

  it('missing username produces validation error', (done) => {
    wrapper.vm.$validator.validate('username')
      .then((result) => {
        expect(result).to.equal(false)
        done()
      })
  })

  it('missing password produces validation error', (done) => {
    wrapper.vm.$validator.validate('password')
      .then((result) => {
        expect(result).to.equal(false)
        done()
      })
  })

  it('provided username passes validation', (done) => {
    wrapper.setData({
      username: 'Foo'
    })

    wrapper.vm.$validator.validate('username')
      .then((result) => {
        expect(result).to.equal(true)
        done()
      })
  })

  it('provided password passes validation', (done) => {
    wrapper.setData({
      password: 'Foo'
    })

    wrapper.vm.$validator.validate('password')
      .then((result) => {
        expect(result).to.equal(true)
        done()
      })
  })
})
