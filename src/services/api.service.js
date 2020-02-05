import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

import { apiConfig } from '../../config/apiConfig'

const BASE_URL = apiConfig.BASE_URL

const ApiService = {
  init() {
    Vue.use(VueAxios, axios)
    Vue.axios.defaults.baseURL = BASE_URL
  },

  setHeader() {
    // TODO
  },

  query(resource, params) {
    return Vue.axios.get(resource, params).catch(error => {
      throw new Error(error)
    })
  },

  get(resource, slug = '') {
    return Vue.axios.get(`${resource}/${slug}`).catch(error => {
      throw new Error(error)
    })
  },

  post(resource, params) {
    return Vue.axios.post(`${resource}`, params);
  },

  update(resource, slug, params) {
    return Vue.axios.put(`${resource}/${slug}`, params);
  },

  put(resource, params) {
    return Vue.axios.put(`${resource}`, params);
  },

  delete(resource) {
    return Vue.axios.delete(resource).catch(error => {
      throw new Error(error)
    })
  }
}

export const PostsService = {
  query(type, params) {
    return ApiService.query('posts', {
      params: params
    })
  },
  get(slug) {
    return ApiService.get('posts', slug)
  },
  create(params) {
    return ApiService.post('posts', { article: params })
  },
  update(slug, params) {
    return ApiService.update('posts', slug, { article: params })
  },
  destroy(slug) {
    return ApiService.delete(`posts/${slug}`)
  },
  upvote() {
    return ApiService.post(`posts/${slug}/upvote`);
  },
  downVote() {
    // change this to a DELETE method?
    return ApiService.post(`posts/${slug}/downVote`);
  },
}

export const CommentsService = {

}

export default ApiService
