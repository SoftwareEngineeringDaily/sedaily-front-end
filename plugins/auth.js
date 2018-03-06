export default function({ $auth }) {
  $auth.onError((error, name, endpoint) => {
    console.error(name, error)
  })
}
