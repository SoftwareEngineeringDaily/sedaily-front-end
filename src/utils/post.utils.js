import isString from 'lodash/isString'
import marked from 'marked'

function postPrettyUrlTitle(post) {
  try {
    const originalTitle = typeof post.title === 'string' ? post.title : post.title.rendered
    if (originalTitle) {
      let title = originalTitle.replace(/[^\w\s]/gi, '')
      // Ghetto way to replace strings, should use regex:
      title = title.split(' ').join('-')
      return title
    } else {
      return ''
    }
  } catch (e) {
    console.log('e', e)
    return ''
  }
}

export const postPrettyUrl = (post) => {
  return '/post/' +  post._id + '/' + postPrettyUrlTitle(post);
}

/**
 * Cleans HTML content for display
 *
 * @param content {String|HTML} - HTML formatted strings to be properly cleaned and formatted
 * @return {String} - Properyl formatted content
 */
export const cleanContent = (content = '') => {
  marked.setOptions({ breaks: true })

  const htmlMarkdown = marked(content)
  const updateLinkToOpenTab = (html) => {
    const regExLink = /\<a href=/gi;
    const updatedLink = '<a target="_blank" href=';
    return html.replace(regExLink, updatedLink);
  }

  return updateLinkToOpenTab(htmlMarkdown)
}

/**
 * Checks if a provided target is within a
 * provided class before it hits the `parentEl`
 *
 * @param parentEl {Node} - The final element to search before giving up/
 * @param className {String} - The selector that a target should be within
 * @param target {Node} - The element to use as a reference for validating within the `className`
 *
 * @return Promise {boolean} - Whether or not the target is within the `className`
 */
export const isWithin = (parentEl, className, target) => {
  return new Promise((resolve, reject) => {
    const findParent = (element) => {
      if (!element) {
        return resolve(false)
      }

      let hasClass = (element.classList && element.classList.contains(className))
      let ieSupport = (isString(element.className) && element.className.indexOf(className) >= 0)

      if (hasClass || ieSupport) {
        return resolve(true)
      }

      if (element == parentEl.parentElement) {
        return resolve(false)
      }

      findParent(element.parentElement)
    }

    findParent(target)
  })
}

/**
 * Creates a properly formatted list of social handles from an array of users
 *
 * @param {array} users - An array of users
 *
 * @return {string} list of social handles
 */
export const formatSocial = (users = [], key, init) => {
  return users.reduce((prev, user) => {
    if (!user || !user[key]) return prev
    prev += user[key] ? ` @${user[key]}` : ''
    return prev
  }, init)
}

export const delay = (() => {
  let timer = 0
  return (callback, ms = 250) => {
    clearTimeout (timer)
    timer = setTimeout(callback, ms)
  }
})()

export const isMobile = (() => {
  if (typeof navigator === 'undefined') {
    return false
  }

  return (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
  )
})()
