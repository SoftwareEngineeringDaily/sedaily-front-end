import { mount } from 'vue-test-utils'
import localVue from './helpers'
import LoginView from '@/views/LoginView.vue'

describe('LoginView.vue', () => {
  const wrapper = mount(LoginView, { localVue })

  it('adds a $validator to the Vue instance', () => {
    expect(wrapper.vm).to.have.property('$validator')
  })

  it('injects an error data object into the Vue instance', () => {
    expect(wrapper.vm.errors).to.not.be.an('undefined')
    expect(wrapper.vm.errors.all().length).to.equal(0)
  })

  it('missing username produces validation error', () => {
    wrapper.vm.$validator.validate('username')
      .then((result) => {
        expect(result).to.equal(false)
      })
  })

  it('missing password produces validation error', () => {
    wrapper.vm.$validator.validate('password')
      .then((result) => {
        expect(result).to.equal(false)
      })
  })

  it('provided username passes validation', () => {
    wrapper.setData({
      username: 'Foo'
    })

    wrapper.vm.$validator.validate('username')
      .then((result) => {
        expect(result).to.equal(true)
      })
  })

  it('provided password passes validation', () => {
    wrapper.setData({
      password: 'Foo'
    })

    wrapper.vm.$validator.validate('password')
      .then((result) => {
        expect(result).to.equal(true)
      })
  })
})
