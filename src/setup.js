import infiniteScroll from 'vue-infinite-scroll'
import VeeValidate from 'vee-validate'
import SocialSharing from 'vue-social-sharing'
import * as filters from './filters'

// setup's Vue (global or instance) with filters and plugins
// for use in multiple environments
const setupVue = (vue) => {
  Object.keys(filters).forEach(key => {
    vue.filter(key, filters[key])
  })

  vue.use(SocialSharing)
  vue.use(infiniteScroll)
  vue.config.productionTip = false
  vue.use(VeeValidate, {
    events: 'blur'
  })
}

export { setupVue }
