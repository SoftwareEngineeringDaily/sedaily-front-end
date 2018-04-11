import store from 'store'

export default function beforeEnter (to, from, next) {
  return (!store.getters.isLoggedIn) ? next('/login') : next()
}
