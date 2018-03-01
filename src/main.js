// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import { sync } from 'vuex-router-sync'

import { setupVue } from './setup'
import router from './router'
import store from './store'
import App from './App'

// sync the router with the vuex store.
// this registers `store.state.route`
sync(store, router)

// register global utility filters and install global plugins
setupVue(Vue)

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
