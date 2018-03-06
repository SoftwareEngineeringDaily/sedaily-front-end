import Vue from 'vue'

Vue.filter('host', (url) => {
  const host = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
  const parts = host.split('.').slice(-3)
  if (parts[0] === 'www') parts.shift()
  return parts.join('.')
})

Vue.filter('timeAgo', (time) => {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
})

function pluralize (time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

Vue.filter('decodeString', (string) => {
  const div = document.createElement('div')
  div.innerHTML = string
  return typeof div.textContent !== 'undefined' ? div.textContent : div.innerText
})

Vue.filter('externalUrl', (url) => {
  let newUrl = url
  if (url.indexOf('://') === -1) {
    newUrl = '//' + url
  }
  return newUrl
})
