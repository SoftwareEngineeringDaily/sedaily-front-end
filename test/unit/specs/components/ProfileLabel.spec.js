import { shallow } from '@vue/test-utils'
import localVue from './../helpers'
import Vuex from 'vuex'
import Router from 'vue-router'
import ProfileLabel from 'components/profile/ProfileLabel'

describe('ProfileLabel.vue', () => {
  localVue.use(Vuex)
  localVue.use(Router)

  let router
  let store
  const initialState = {
    placeholderAvatar: 'https://s3-us-west-2.amazonaws.com/sd-profile-pictures/profile-icon-9.png'
  }

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
    const wrapper = shallow(ProfileLabel, {
      localVue,
      store,
      router,
      propsData: {
        userData
      }
    })
    expect(wrapper.find('span').text()).to.have.string(userData.name)
  })

  it('should render username if name does not exist', () => {
    const userData = {
      _id: '5a7eecd7d5088737e5fb8a59',
      username: 'username'
    }
    const wrapper = shallow(ProfileLabel, {
      localVue,
      store,
      router,
      propsData: {
        userData
      }
    })
    expect(wrapper.find('span').text()).to.have.string(userData.username)
  })

  it('should contain anchor with user._id in href', () => {
    const userData = {
      _id: '5a7eecd7d5088737e5fb8a59',
      username: 'username'
    }
    const wrapper = shallow(ProfileLabel, {
      localVue,
      store,
      router,
      propsData: {
        userData
      }
    })
    expect(wrapper.find('a').attributes().href.split('/').slice(-1)[0]).to.equal(userData._id)
  })

  it('should contain img with default avatarUrl if user avatarUrl does not exist', () => {
    const userData = {
      _id: '5a7eecd7d5088737e5fb8a59',
      username: 'username'
    }
    const wrapper = shallow(ProfileLabel, {
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
    const wrapper = shallow(ProfileLabel, {
      localVue,
      store,
      router,
      propsData: {
        userData
      }
    })
    expect(wrapper.find('img').attributes().src).to.equal(userData.avatarUrl)
  })
})
