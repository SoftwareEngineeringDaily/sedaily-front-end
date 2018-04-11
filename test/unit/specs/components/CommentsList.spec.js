import { mount, shallow, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Router from 'vue-router'
import router from 'router'
import initialState from 'store/initialState'
import CommentsList from 'components/comment/CommentsList'
import CommentView from 'components/comment/CommentView'
import CommentReply from 'components/comment/CommentReply'

describe('CommentsList', (done) => {
  const localVue = createLocalVue()

  localVue.use(Vuex)
  localVue.use(Router)

  let sandbox

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should render all comments', () => {
    const store = new Vuex.Store({
      state: {
        ...initialState,
        route: {
          params: {
            id: 'foo'
          }
        }
      },
      router,
      getters: {
        isLoggedIn: sandbox.stub().returns(true)
      }
    })

    const wrapper = shallow(CommentsList, {
      localVue,
      store,
      propsData: {
        rootEntityType: 'post',
        comments: [
          { _id: 23, upvoted: false, score: 0, content: 'foo', author: 'me' },
          { _id: 36, upvoted: false, score: 0, content: 'bar', author: 'you' }
        ]
      }
    })

    expect(wrapper.findAll(CommentView).length).to.equal(2)
  })

  it('should render reply box when logged in', () => {
    const store = new Vuex.Store({
      state: initialState,
      getters: {
        isLoggedIn: sandbox.stub().returns(true)
      }
    })

    const wrapper = mount(CommentsList, {
      localVue,
      store,
      router,
      propsData: {
        rootEntityType: 'post',
        comments: [
          { _id: 23, upvoted: false, score: 0, content: 'foo', author: 'me' }
        ]
      }
    })

    expect(wrapper.find(CommentReply).exists()).to.equal(true)
  })

  it('should not render reply when logged out', () => {
    const store = new Vuex.Store({
      state: initialState,
      getters: {
        isLoggedIn: sandbox.stub().returns(false)
      }
    })

    const wrapper = mount(CommentsList, {
      localVue,
      store,
      router,
      propsData: {
        rootEntityType: 'post',
        comments: [
          { _id: 23, upvoted: false, score: 0, content: 'foo', author: 'me' }
        ]
      }
    })

    expect(wrapper.find(CommentReply).exists()).to.equal(false)
  })
})
