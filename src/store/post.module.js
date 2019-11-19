import Vue from 'vue'
import { PostsService } from '@/services/api.service'
import { FETCH_POST, FETCH_COMMENTS } from './actions.type'
import {
  RESET_STATE,
  SET_POST,
  SET_COMMENTS,
  UPDATE_POST_IN_LIST
} from './mutations.type'

export const actions = {
  async [FETCH_POST](context, postID, prevPost) {
    if (prevArticle !== undefined) {
      return context.commit(SET_POST, prevArticle)
    }
    const { data } = await PostsService.get(postID)
    context.commit(SET_POST, data.post)
    return data;
  }
}

export const mutations = {
  [SET_POST](state, article) {
    state.article = article;
  }
}

const getters = {
  article(state) {
    return state.article;
  },
  comments(state) {
    return state.comments;
  }
}

export default {
  actions,
  mutations,
  getters
}




