// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Router from 'vue-router'
import Meta from 'vue-meta'
import router from './router'
import store from './store'
import * as filters from './filters'

import { sync } from 'vuex-router-sync'
import AuthPlugin from './plugins/AuthPlugin'
import infiniteScroll from 'vue-infinite-scroll'
import VeeValidate from 'vee-validate'
import SocialSharing from 'vue-social-sharing'
import VueAnalytics from 'vue-analytics'
import Toasted from 'vue-toasted'
import vueResource from 'vue-resource'

import 'bootstrap'
import './css/vendor.scss'

// sync the router with the vuex store.
// this registers `store.state.route`
sync(store, router)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(Router)
Vue.use(SocialSharing)
Vue.use(infiniteScroll)
Vue.use(Meta)
Vue.config.productionTip = false

Vue.use(Toasted, {
  position: 'bottom-center',
  theme: 'primary',
  duration: null,
  action: {
    text: 'Close',
    onClick: (e, toastObject) => {
      toastObject.goAway(0)
    }
  }
})

Vue.use(AuthPlugin)

Vue.use(VeeValidate, {
  events: 'blur'
})

Vue.use(vueResource)
Vue.http.interceptors.push((request, next) => {
  const token = Vue.auth.getToken()

  if (token) {
    request.headers.set('Content-Type', 'application/json')
    request.headers.set('Authorization', `Bearer ${token}`)
  }
  next()
})

Vue.use(VueAnalytics, {
  id: 'UA-111896817-1', // PROD
  // id: 'UA-118659350-1', // STAGING
  checkDuplicatedScript: true,
  router
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  created () {
    if (store.getters.isLoggedIn) {
      store.dispatch('fetchMyProfileData')
    }
  }
})
