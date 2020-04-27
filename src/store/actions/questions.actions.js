import axios from 'axios'
import { apiConfig } from '../../../config/apiConfig'
const BASE_URL = apiConfig.BASE_URL

export default {
  
  getEntityQuestions: (_, { entityId, entityType } ) => {
    return axios.get(`${BASE_URL}/question/entity/${entityType}/${entityId}`)
    .then((response) => {
      return response.data
    })
  },

  createQuestionBatch: (_, { questions, entityId, entityType } ) => {
    return axios.post(`${BASE_URL}/question`, { questions, entityId, entityType })
    .then((response) => {
      return response.data
    })
  },

  updateQuestion: (_, { content, questionId } ) => {
    return axios.put(`${BASE_URL}/question/${questionId}`, { content })
    .then((response) => {
      return response.data
    })
  },

  deleteQuestion: (_, { questionId } ) => {
    return axios.delete(`${BASE_URL}/question/${questionId}`)
    .then((response) => {
      return response.data
    })
  },
}
