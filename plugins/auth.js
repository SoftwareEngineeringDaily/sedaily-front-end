export default function({ app }) {
  app.$auth.onError((error, name, endpoint) => {
    console.error(name, error)
    app.$toast.error('Authorisation error: ' + error.message)
  })
}
