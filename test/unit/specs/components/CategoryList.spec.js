import { shallow, createLocalVue } from '@vue/test-utils'
import CategoryList from 'components/CategoryList'

describe('CategoryList', (done) => {
  const localVue = createLocalVue()

  it('should render all categories plus All', () => {
    const wrapper = shallow(CategoryList, {
      localVue,
      propsData: {
        categories: [
          { id: 23, name: 'Foo' },
          { id: 36, name: 'Bar' }
        ]
      }
    })

    expect(wrapper.findAll('.category-post').length).to.equal(3)
  })

  it('should render current categories as active', () => {
    const wrapper = shallow(CategoryList, {
      localVue,
      propsData: {
        categories: [
          { id: 23, name: 'Foo' },
          { id: 36, name: 'Bar' }
        ],
        activeCategory: { id: 23, name: 'Foo' }
      }
    })

    expect(wrapper.find('.category-active').text()).to.equal('Foo')
  })

  it('should emit event when new category selected', () => {
    const wrapper = shallow(CategoryList, {
      localVue,
      propsData: {
        categories: [
          { id: 23, name: 'Foo' },
          { id: 36, name: 'Bar' }
        ],
        activeCategory: { id: 23, name: 'Foo' }
      }
    })

    wrapper.findAll('span:not(.category-active)').at(0).trigger('click')
    expect(wrapper.emitted().setSelectedCategory.length).to.equal(1)
  })
})
