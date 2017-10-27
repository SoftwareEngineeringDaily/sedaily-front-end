import axios from 'axios'
import {BASE_URL} from './config.js'

export default {
  commentsCreate ({commit, getters}, {content, postId}) {
    let options = {content}
    let token = getters.getToken
    let config = {}
    if (token) {
      config.headers = {
        'Authorization': 'Bearer ' + token
      }
    }

    let url = `${BASE_URL}/posts/${postId}/comment`

    commit('commentPrepend', {content, postId, dateCreated: Date.now()})
    return axios.post(url, options, config)
  },
  commentsFetch ({getters, commit}, {postId}) {
    let options = {}
    let token = getters.getToken
    if (token) {
      options.headers = {
        'Authorization': 'Bearer ' + token
      }
    }

    let url = `${BASE_URL}/posts/${postId}/comments`
    return axios.get(url, options)
      .then((response) => {
        const comments = response.data.result
        commit('setComments', {postId, comments})
        return comments
      })
  }
}
