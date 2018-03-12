export default function ({ $axios, redirect, app, store }) {
  $axios.onError(error => {
    console.log(error)
    app.$toast.error('Error while making request: ' + error.message)
 })
}
