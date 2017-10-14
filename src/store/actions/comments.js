import axios from 'axios'
import {BASE_URL} from './config.js'

export default {
  commentsCreate ({getters}, {content, postId}) {
    let options = {content}
    let token = getters.getToken
    if (token) {
      options.headers = {
        'Authorization': 'Bearer ' + token
      }
    }

    let url = `${BASE_URL}/posts/${postId}`
    return axios.get(url, options)
    .then((response) => {
      console.log('create comment response', response)
    })
    .catch((error) => {
      console.error('create comment', error.response)
      alert(error.response.data.message)
    })
  },
  commentsFetch ({postId}) {
  }
}
