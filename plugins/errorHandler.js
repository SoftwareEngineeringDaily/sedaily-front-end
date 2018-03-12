export default function ({ $axios, redirect, app, store }) {
  $axios.onError(error => {
    console.log(error)
    app.$toast.error('Error while making request: ' + error.message, {
      theme: 'primary',
      duration: null,
      action: {
        text : 'Close',
        onClick : (e, toastObject) => {
            toastObject.goAway(0);
        }
      }
    })
 })
}
