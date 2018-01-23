// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import * as filters from './filters'

import { sync } from 'vuex-router-sync'
import infiniteScroll from 'vue-infinite-scroll'
import VeeValidate from 'vee-validate'
import SocialSharing from 'vue-social-sharing'
import VueAnalytics from 'vue-analytics'

// sync the router with the vuex store.
// this registers `store.state.route`
sync(store, router)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(SocialSharing)
Vue.use(infiniteScroll)
Vue.config.productionTip = false
Vue.use(VeeValidate)
Vue.use(VueAnalytics, {
  id: 'UA-111896817-1',
  checkDuplicatedScript: true,
  router
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
