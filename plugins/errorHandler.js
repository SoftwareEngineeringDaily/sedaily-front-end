export default function ({ $axios, redirect, app, store }) {
  $axios.onError(error => {
    // with @nuxtjs/toast
    app.$toast.error('Error while making request: ' + error.message)
 })
}
