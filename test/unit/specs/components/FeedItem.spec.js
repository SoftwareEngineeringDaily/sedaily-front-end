import { shallow, createLocalVue } from '@vue/test-utils'
import FeedItem from '@/components/FeedItem.vue'

describe('FeedItem.vue', () => {
  const localVue = createLocalVue()

  const feedItem = {
    url: 'http://foo.com',
    image: 'bar',
    title: 'Test',
    description: 'Test Feed Item',
    score: 6
  }

  const createComponentWrapper = (props = feedItem) => shallow(FeedItem, {
    propsData: { feedItem: props, localVue }
  })

  it('should render url from props', () => {
    const wrapper = createComponentWrapper()
    expect(wrapper.find('a').attributes().href).to.equal(feedItem.url)
  })

  it('should render title from props', () => {
    const wrapper = createComponentWrapper()
    expect(wrapper.find('.title').text()).to.equal(feedItem.title)
  })

  it('should render url as title when title is missing', () => {
    const feedItemWithoutTitle = {
      ...feedItem,
      title: ''
    }

    const wrapper = createComponentWrapper(feedItemWithoutTitle)
    expect(wrapper.find('.title').text()).to.equal(feedItem.url)
  })

  it('should return default image when not provided', () => {
    const feedItemWithoutImage = {
      ...feedItem,
      image: undefined
    }

    const wrapper = createComponentWrapper(feedItemWithoutImage)
    expect(wrapper.vm.imageStyle).to.not.be.an('undefined')
  })
})
