import Vue from 'vue'
import VeeValidate from 'vee-validate'
import infiniteScroll from 'vue-infinite-scroll'
import SocialSharing from 'vue-social-sharing'
import * as filters from '@/filters'

// use same global plugins & filters as app
Vue.use(VeeValidate, {
  events: 'blur'
})
Vue.use(infiniteScroll)
Vue.use(SocialSharing)

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

// require all test files (files that ends with .spec.js)
const testsContext = require.context('./specs', true, /\.spec$/)
testsContext.keys().forEach(testsContext)

// require all src files except main.js for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.
const srcContext = require.context('../../src', true, /^\.\/(?!main(\.js)?$)/)
srcContext.keys().forEach(srcContext)
