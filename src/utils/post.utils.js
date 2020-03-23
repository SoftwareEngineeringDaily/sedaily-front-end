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

export function postPrettyUrl(post) {
  return '/post/' +  post._id + '/' + postPrettyUrlTitle(post);
}

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
