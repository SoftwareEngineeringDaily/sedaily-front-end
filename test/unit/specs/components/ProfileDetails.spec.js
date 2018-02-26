import { shallow, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Router from 'vue-router'
import ProfileDetails from '@/components/ProfileDetails.vue'
import initialState from '@/store/initialState'
import { host, externalUrl } from '@/filters'

describe('ProfileDetails.vue', () => {
  const localVue = createLocalVue()

  localVue.use(Vuex)
  localVue.use(Router)

  let router
  let store

  beforeEach(() => {
    router = new Router()

    store = new Vuex.Store({
      state: initialState
    })
  })

  it('should render name if it exists', () => {
    const userData = {
      _id: '5a7eecd7d5088737e5fb8a59',
      username: 'username',
      name: 'First Last'
    }
    const wrapper = shallow(ProfileDetails, {
      localVue,
      store,
      router,
      propsData: {
        userData
      }
    })
    expect(wrapper.find('h4').text()).to.have.string(userData.name)
  })

  it('should render username if name does not exist', () => {
    const userData = {
      _id: '5a7eecd7d5088737e5fb8a59',
      username: 'username'
    }
    const wrapper = shallow(ProfileDetails, {
      localVue,
      store,
      router,
      propsData: {
        userData
      }
    })
    expect(wrapper.find('h4').text()).to.have.string(userData.username)
  })

  it('should contain img with default avatarUrl if user avatarUrl does not exist', () => {
    const userData = {
      _id: '5a7eecd7d5088737e5fb8a59',
      username: 'username'
    }
    const wrapper = shallow(ProfileDetails, {
      localVue,
      store,
      router,
      propsData: {
        userData
      }
    })
    expect(wrapper.find('img').attributes().src).to.equal(initialState.placeholderAvatar)
  })

  it('should contain img with user avatarUrl if it exists', () => {
    const userData = {
      _id: '5a7eecd7d5088737e5fb8a59',
      username: 'username',
      avatarUrl: 'https://s3-us-west-2.amazonaws.com/sd-profile-pictures/user.png'
    }
    const wrapper = shallow(ProfileDetails, {
      localVue,
      store,
      router,
      propsData: {
        userData
      }
    })
    expect(wrapper.find('img').attributes().src).to.equal(userData.avatarUrl)
  })

  it('should render website url if it exists', () => {
    const userData = {
      _id: '5a7eecd7d5088737e5fb8a59',
      username: 'username',
      website: 'user.com'
    }
    const wrapper = shallow(ProfileDetails, {
      localVue,
      store,
      router,
      propsData: {
        userData
      }
    })
    expect(wrapper.find('a').attributes().href).to.equal(externalUrl(userData.website))
    expect(wrapper.find('a').text()).to.equal(host(userData.website))
  })

  it('should render bio if it exists', () => {
    const userData = {
      _id: '5a7eecd7d5088737e5fb8a59',
      username: 'username',
      bio: 'My bio'
    }
    const wrapper = shallow(ProfileDetails, {
      localVue,
      store,
      router,
      propsData: {
        userData
      }
    })
    expect(wrapper.find('small').text()).to.equal(userData.bio)
  })

  it('should render alternate bio if bio does not exist', () => {
    const userData = {
      _id: '5a7eecd7d5088737e5fb8a59',
      username: 'username'
    }
    const wrapper = shallow(ProfileDetails, {
      localVue,
      store,
      router,
      propsData: {
        userData
      }
    })
    expect(wrapper.find('small').text()).to.have.lengthOf.above(1)
  })
})
