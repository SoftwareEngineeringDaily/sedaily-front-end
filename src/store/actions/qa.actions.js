import Vue from 'vue'
import axios from 'axios'
import isObject from 'lodash/isObject'
import remove from 'lodash/remove'
import { apiConfig } from '../../../config/apiConfig'

const BASE_URL = apiConfig.BASE_URL

export default {
  getEntityQuestions: (_, { entityId, entityType } ) => {
    return axios.get(`${BASE_URL}/question/entity/${entityType}/${entityId}`)
    .then((response) => {
      const questions = response.data || []

      questions.forEach((question) => {
        question.answers = (question.answers || [])
          .filter(q => !(q.deleted))
      })

      _.commit('setQuestions', questions)

      return response.data
    })
  },

  getUnansweredQuestions: ({ commit }, limit) => {
    return axios.get(`${BASE_URL}/question/unanswered/?limit=${limit || 10}`)
    .then((response) => {
      const questions = response.data || []

      commit('setUnansweredQuestions', questions)

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

  createQuestion: (_, data) => {
    return axios.post(`${BASE_URL}/question`, data)
    .then((response) => {
      return response
    })
  },

  /**
   * Answers
   */
  createAnswer: ({ commit, state, getters }, data) => {
    return axios
      .post(`${BASE_URL}/answer`, data)
      .then((reply) => {
        let questions = [
          ...state.topics.questions
        ]

        questions.forEach((question) => {
          if (question._id === reply.data.question)  {
            question.answers = question.answers || []
            question.answers.push({
              ...reply.data,
              author: state.me,
            })
          }
        })

        commit('setQuestions', questions)
      })
  },

  updateAnswer: ({ commit, state, getters }, { _id, question, content }) => {
    return axios
      .put(`${BASE_URL}/answer/${_id}`, { content })
      .then(({ data }) => {
        let questions = [
          ...state.topics.questions
        ]

        questions.forEach(q => {
          if (q._id === data.question)  {
            q.answers.forEach(answer => {
              if (answer._id === data._id) {
                answer = data
              }
            })
          }
        })

        commit('setQuestions', questions)
      })
  },

  deleteAnswer: ({ commit, state, getters }, _id) => {
    return axios
      .delete(`${BASE_URL}/answer/${_id}`)
      .then((reply) => {
        const questions = [ ...state.topics.questions ]

        let posts = { ...state.posts }
        let postIds = Object.keys(posts)

        questions.forEach(question => {
          if (question._id === reply.data.question)  {
            question.answers = question.answers || []
            question.answers = question.answers.filter(a => a._id !== reply.data._id)
          }
        })

        postIds = postIds.filter(id => (id !== _id))
        posts = postIds.map(id => posts[id])

        commit('setQuestions', questions)
        commit('setPosts', { posts })
      })
  },

  voteAnswer: ({ commit, getters, state }, { _id, question }) => {
    let questions = [ ...state.topics.questions ]
    let posts = { ...state.posts } // clone(state.posts)
    let postIds = Object.keys(posts)

    const url = `${BASE_URL}/answer/${_id}/vote`
    const { me } = state
    const toggleVote = () => {
      const updateAnswer = (answer) => {
        if (answer._id === _id) {
          answer.votes = answer.votes || []

          if (answer.votes.indexOf(me._id) >= 0) {
            answer.votes = answer.votes.filter(v => v !== me._id)
          }
          else {
            answer.votes.push(me._id)
          }
        }
      }

      // Update Main Feed
      if (posts[_id]) {
        updateAnswer(posts[_id])
      }

      // Update Topic Questions
      questions.forEach(q => {
        const questionId = isObject(question) ? question._id : question
        if (q._id === questionId)  {
          q.answers.forEach(updateAnswer)
        }
      })
    }

    if (!getters.isLoggedIn) {
      Vue.toasted.error('You must be logged in to like a post', toastOptions)
    }

    toggleVote() // Immediately update locally

    commit('setQuestions', questions)
    commit('setPosts', { posts: postIds.map(id => posts[id]) })

    return axios.post(url)
      .then(({ data }) => {

        if (!data) {
          return toggleVote()
        }

        questions.forEach(q => {
          q.answers.sort((a, b) => {
            return b.votes.length - a.votes.length
          })
        })

        commit('setQuestions', questions)
        commit('setPosts', { posts: postIds.map(id => posts[id]) })
      })
      .catch((error) => {

          // Reset post on error
          toggleVote()
          Vue.toasted.error(error.response.data)
      })
  },
}
