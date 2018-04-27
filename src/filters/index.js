import Vue from 'vue'

function host (url) {
  const host = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
  const parts = host.split('.').slice(-3)
  if (parts[0] === 'www') parts.shift()
  return parts.join('.')
}

function timeAgo (time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

function pluralize (time, label) {
  return time === 1
    ? time + label
    : time + label + 's'
}

function decodeString (string) {
  const div = document.createElement('div')
  div.innerHTML = string
  return typeof div.textContent !== 'undefined' ? div.textContent : div.innerText
}

function externalUrl (url) {
  let newUrl = url
  if (url.indexOf('://') === -1) {
    newUrl = '//' + url
  }
  return newUrl
}

export default {
  host,
  timeAgo,
  pluralize,
  decodeString,
  externalUrl
}
