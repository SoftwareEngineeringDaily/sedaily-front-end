import { shallow, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
import Router from 'vue-router'
import Toasted from 'vue-toasted'
import RelatedLinkCompose from 'components/RelatedLinkCompose.vue'

describe('RelatedLinkCompose.vue', (done) => {
  const localVue = createLocalVue()

  localVue.use(Vuex)
  localVue.use(Router)
  localVue.use(Toasted)
  localVue.use(VeeValidate, {
    events: 'blur'
  })

  let sandbox
  let actions
  let router
  let wrapper

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
    sandbox.stub(window, 'alert').returns(false)

    router = new Router()

    actions = {
      relatedLinksCreate: sandbox.stub().returns(false),
      relatedLinksFetch: sandbox.stub().returns(false)
    }

    const store = new Vuex.Store({
      state: {
        route: {
          params: {
            id: 1
          }
        }
      },
      actions
    })

    wrapper = shallow(RelatedLinkCompose, {
      localVue,
      store,
      router
    })
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should validate missing url', (done) => {
    wrapper.setData({
      url: '',
      title: 'Foo'
    })

    wrapper.vm.submit().then(() => {
      expect(wrapper.vm.errors.all().length).to.equal(1)
      expect(wrapper.vm.errors.has('url')).to.equal(true)
      done()
    })
  })

  it('should validate missing title', (done) => {
    wrapper.setData({
      url: 'http://foo.com',
      title: ''
    })

    wrapper.vm.submit().then(() => {
      expect(wrapper.vm.errors.all().length).to.equal(1)
      expect(wrapper.vm.errors.has('title')).to.equal(true)
      done()
    })
  })

  it('should show no validation errors after clean submit', (done) => {
    wrapper.setData({
      url: 'http://foo.com',
      title: 'foo'
    })

    wrapper.vm.submit().then(() => {
      expect(wrapper.vm.errors.all().length).to.equal(0)
      done()
    })
  })
})
