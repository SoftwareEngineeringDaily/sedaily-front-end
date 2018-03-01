import { mount } from '@vue/test-utils'
import { localVue } from '../../helpers'
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
