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
import InstantSearch from 'vue-instantsearch'
import SmartBanner from 'smart-app-banner'
import BootstrapVue from 'bootstrap-vue'
import socketio from 'socket.io-client';
import VueSocketIO from 'vue-socket.io'
import { apiConfig } from '../config/apiConfig'

import 'smart-app-banner/dist/smart-app-banner.css'

// import 'bootstrap'
import './css/vendor.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

const WS_URL = apiConfig.BASE_URL.replace('/api', '');

// sync the router with the vuex store.
// this registers `store.state.route`
sync(store, router)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(Meta)
Vue.use(Router)
Vue.use(SocialSharing)
Vue.use(infiniteScroll)
Vue.use(BootstrapVue)
Vue.use(InstantSearch)
Vue.config.productionTip = false

Vue.use(Toasted, {
  theme: 'bubble',
  position: 'bottom-center',
  duration: 5000,
  singleton: true,
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

Vue.use(VueAnalytics, {
  id: 'UA-111896817-1', // PROD
  // id: 'UA-118659350-1', // STAGING
  checkDuplicatedScript: true,
  router
})
Vue.directive('click-outside', {
  bind: function (el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      if (!(el == event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind: function (el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  },
})

Vue.use(new VueSocketIO({
  connection: socketio(WS_URL),
  vuex: {
    store,
    actionPrefix: "notification.",
    mutationPrefix: "notification."
  }
}));

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
    new SmartBanner({
      daysHidden: -1,
      daysReminder: -1,
      title: 'Software Engineering Daily',
      author: 'SED',
      button: 'VIEW',
      icon: "https://is5-ssl.mzstatic.com/image/thumb/Purple125/v4/db/6f/98/db6f983f-a6cc-22e9-62d0-47a6e047ac94/AppIcon-1x_U007emarketing-0-0-GLES2_U002c0-512MB-sRGB-0-0-0-85-220-0-0-0-9.png/230x0w.jpg",
      store: {
        ios: 'On the App Store',
        android: 'In Google Play',
      },
      price: {
        ios: 'FREE',
        android: 'FREE'
      },
    })
  }
})
