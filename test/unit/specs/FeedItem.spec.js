import { shallow, createLocalVue } from 'vue-test-utils'
import FeedItem from '@/components/FeedItem.vue'

describe('FeedItem.vue', () => {
  it('should receive props', () => {
    const localVue = createLocalVue()

    const props = {
      image: 'foo'
    }

    const feedItem = shallow(FeedItem, {
      propsData: {
        feedItem: props
      },
      localVue
    })

    expect(feedItem.props().feedItem.image).to.equal('foo')
  })
})
