import axios from 'axios'
import { apiConfig } from '../../../config/apiConfig'
const BASE_URL = apiConfig.BASE_URL

export default {
  
  getTopicPage: (_, slug ) => {
    return axios.get(`${BASE_URL}/topicpage/${slug}`)
    .then((response) => {
      return response.data
    })
  },

  getTopicPageEdit: (_, slug ) => {
    return axios.get(`${BASE_URL}/topicpage/${slug}/edit`)
    .then((response) => {
      return response.data
    })
  },

  saveTopicPage: (_, { slug, data } ) => {
    return axios.put(`${BASE_URL}/topicpage/${slug}`, data)
    .then((response) => {
      return response.data
    })
  },

}
