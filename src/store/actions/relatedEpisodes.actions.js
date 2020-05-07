import axios from 'axios'
import { apiConfig } from '../../../config/apiConfig'

const BASE_URL = apiConfig.BASE_URL

export default {

    fetchRelatedEpisodes ({ _, commit }, { postId }) {
        return axios.get(`${BASE_URL}/posts/${postId}/related-episodes`)
          .then((response) => {
            commit('setRelatedEpisodes', response.data)
            return response.data
          })
    },

    saveRelatedEpisode (_, { postId, episodeSlug }) {
        return axios.post(`${BASE_URL}/posts/${postId}/related-episodes/${episodeSlug}`)
          .then((response) => {
            return response.data
          })
    },

    removeRelatedEpisode(_, { postId, episodeSlug }) {
        return axios.delete(`${BASE_URL}/posts/${postId}/related-episodes/${episodeSlug}`)
          .then((response) => {
            return response.data
          })
    },
}
