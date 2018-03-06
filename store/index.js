import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'
import initialState from './initialState'

const createStore = () => {
  return new Vuex.Store({
    state: initialState,
    actions,
    mutations,
    getters
  })
}

export default createStore
