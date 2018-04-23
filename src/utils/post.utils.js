
function postPrettyUrlTitle(post) {
  try {
    const originalTitle = post.title.rendered
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
