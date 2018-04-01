import Vue from 'vue'
import axios from 'axios'
import { apiConfig } from '../../../config/apiConfig'
import { eventApiEnv } from '../../../config/apiConfig'
import { EventType } from './../../utils/eventType'
const EVENTS_API_BASE_URL = apiConfig.EVENTS_API_BASE_URL

function eventRequestWrapper (username, eventType, eventData) {
  return axios.post(`${EVENTS_API_BASE_URL}`, {
    clientId: username,
    deviceType: 'Browser',
    eventTime: new Date().getTime(),
    eventType: eventType,
    eventData,
    eventApiEnv
  })
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.log('Error sending event:', error.response ? error.response : error)
      return error
    })
}

export default {
  enableLogging: ({ commit, getters, state }) => {
    if (!getters.isLoggedIn) {
      Vue.toasted.error('Login to enable logging')
      return
    }
    commit('enableLogging')
  },

  disableLogging: ({ commit, getters, state }) => {
    if (!getters.isLoggedIn) {
      Vue.toasted.error('Login to disable logging')
      return
    }
    commit('disableLogging')
  },

  registerEvent: ({ commit, state }, { username }) => {
    return eventRequestWrapper(username, EventType.REGISTER, {})
  },

  loginEvent: ({ commit, state }, { username }) => {
    return eventRequestWrapper(username, EventType.LOGIN, {})
  },

  playEpisodeEvent: ({ commit, state }, playEvent) => {
    const eventData = {
      episodeName: playEvent.episodeName,
      minutesPlayed: playEvent.minutesPlayed,
      minutesRemaining: playEvent.minutesRemaining
    }
    return eventRequestWrapper(state.me.username, EventType.PLAY_EPISODE, eventData)
  },

  completedEpisodeEvent: ({ commit, state }, playEvent) => {
    const eventData = {
      episodeName: playEvent.episodeName
    }
    return eventRequestWrapper(state.me.username, EventType.COMPLETED_EPISODE, eventData)
  }
}
