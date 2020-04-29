import Vue from 'vue'
import find from 'lodash/find'
import { repliesToIds } from '@/utils/comment.utils'

export default {
  analytics: (state, {}) => {
    state.analytics = ''
  },

  setActivePostInPlayer: (state, { post }) => {
    state.activePlayerPost = post
  },

  updatePlayerState: (state, playerState) => {
    state.playerState = playerState
  },

  setActiveType: (state, { type }) => {
    state.activeType = type
  },

  setSearchTerm: (state, { searchTerm }) => {
    state.searchTerm = searchTerm
  },

  setMe: (state, me) => {
    state.me = me
  },

  // Topics
  setTopicPage: (state, topicpage) => {
    state.topics.topicpage = topicpage
  },
  setRecentTopicPages: (state, recentTopicPages = []) => {
    state.topics.recentTopicPages = recentTopicPages
  },
  setAllTopics: (state, topics) => {
    state.topics.all = topics
  },
  setUserTopics: (state, topics) => {
    state.topics.user = topics
  },
  setPostTopics: (state, topics) => {
    state.topics.post = topics
  },
  setSearchedAllTopics: (state, topics) => {
    state.topics.searchedAllTopics = topics
  },
  setQuestions: (state, questions = []) => {
    state.topics.questions = questions
  },

  setSearchTopic: (state, topic) => {
    state.searchTopic = topic.posts
  },
  commentsToggle: (state, { id }) => {
    state.commentsView = id
  },
  setMostPopular: (state, topics) => {
    state.topics.mostPopular = topics
  },

  setList: (state, { type, posts }) => {
    // This is currently doing an append to the list but
    // it should probably do a simple set like the function name
    // suggets.
    //
    // Though, I imagine what we are aiming for is to have pagination be
    // cached and so for that I think a better approach might be a simple
    // map. I am leaning towards not caching for the time being to avoid
    // extra complexity.
    state.lists[type] = state.lists[type].concat(posts)
  },
  /*
  commentPrepend: (state, comment) => {
    if (!state.entityComments[comment.rootEntity]) {
      Vue.set(state.entityComments, comment.rootEntity, [])
    }
    state.entityComments[comment.rootEntity].unshift(comment)
  },*/
  setCompanies: (state, { companies }) => {
    Vue.set(state, 'companies', companies)
  },

  setComments: (state, { comments, entityId }) => {
    const ids = []
    comments.reverse()
    comments.forEach(comment => {
      if (comment) {
        Vue.set(state.comments, comment._id, comment)
        if (!comment.replies) return
        // Loop to get replies:
        comment.replies = repliesToIds({ state, replies: comment.replies })
      }
    })

    comments.map((entity) =>
      { if (entity.deleted === false) {
        ids.push(entity._id) } else {
          return
        }
      })

    //  Only set top level comments:
    Vue.set(state.entityComments, entityId, ids)
  },

  setRelatedLinks: (state, { relatedLinks, postId, topicSlug }) => {
    Vue.set(state.postRelatedLinks, postId || topicSlug, relatedLinks)
  },

  setFeedItems: (state, { feedItems }) => {
    state.feed = feedItems
  },

  setComment: (state, { entity }) => {
    const comment = entity
    if (comment.replies) {
      comment.replies = repliesToIds({ state,
        replies: comment.replies
      })
    }
    Vue.set(state.comments, entity._id, entity)
  },

  setForumThread: (state, { entity }) => {
    Vue.set(state.forumThreads, entity._id, entity)
  },

  setForumThreads: (state, { list }) => {
    list.forEach(entity => {
      if (entity) {
        Vue.set(state.forumThreads, entity._id, entity)
      }
    })
    const ids = list.map((thread) => thread._id)
    Vue.set(state, 'forumThreadIdsList', ids)
  },

  setPost: (state, { post }) => {
    state.post = post
    Vue.set(state.post, post._id, post)
  },

  setPosts: (state, { posts }) => {
    state.posts = {}
    posts.forEach(post => {
      if (post) {
        Vue.set(state.posts, post._id, post)
      }
    })
  },

  setPopularPosts: (state, { posts }) => {
    state.popularPosts = {}
    posts.forEach(post => {
      if (post) {
        Vue.set(state.popularPosts, post._id, post)
      }
    })
  },

  setNextPage: (state, { nextPage }) => {
    state.nextPage = nextPage
  },

  upvoteRelatedLink: (state, { id, postId }) => {
    const links = state.postRelatedLinks[postId]

    if (!links) return
    const entity = find(links, (link) => {
      return link._id === id
    })
    if (!entity) return
    const incrementValue = 1
    if (!entity.score) entity.score = 0
    if (entity.upvoted) {
      entity.score -= incrementValue
    } else {
      entity.score += incrementValue
    }
    entity.upvoted = !entity.upvoted
    entity.downvoted = false
    Vue.set(state.postRelatedLinks, postId, links)
  },

  downvoteRelatedLink: (state, { id, postId }) => {
    const links = state.postRelatedLinks[postId]
    if (!links) return
    const entity = find(links, (link) => {
      return link._id === id
    })
    if (!entity) return
    if (!entity.score) entity.score = 0
    let incrementValue = 1
    if (entity.upvoted) incrementValue += 1

    if (entity.downvoted) {
      entity.score += incrementValue
    } else {
      entity.score -= incrementValue
    }
    entity.upvoted = false
    entity.downvoted = !entity.downvoted

    Vue.set(state.postRelatedLinks, postId, links)
  },

  upVote: (state, { articleId }) => {
    let incrementValue = 1
    // if (state.posts[articleId].downvoted) incrementValue += 1
    console.log(state.posts[articleId])

    if (state.posts[articleId].upvoted) {
      state.posts[articleId].score -= incrementValue
    } else {
      state.posts[articleId].score += incrementValue
    }
    state.posts[articleId].upvoted = !state.posts[articleId].upvoted
    state.posts[articleId].downvoted = false
  },

  downVote: (state, { articleId }) => {
    let incrementValue = 1

    // if (state.posts[articeId].upvoted) incrementValue += 1
    if (state.posts[articleId].downvoted) {
      state.posts[articleId].score -= incrementValue
    } else if (state.posts[articleId].upvoted) {
      state.posts[articleId].score += incrementValue
    }
    state.posts[articleId].upvoted = false
    state.posts[articleId].downvoted = !state.posts[articleId].downvoted
  },

  setToken: (state, token) => {
    localStorage.setItem('token', token)
    state.token = token
  },

  toggleChatWindow: (state) => {
    state.chat.settings.displayBox = !state.chat.settings.displayBox
  },
  addChatMessage: ({ chat }, message) => {
    const formatted = { ...message, sent_at: new Date(message.sent_at) } // eslint-disable-line camelcase
    chat.messages.push(formatted)
  },
  setChatOnline: ({ chat }) => (chat.online = true),
  setChatOffline: ({ chat }) => (chat.online = false),
  enableLogging: (state) => {
    state.loggingEnabled = true
  },

  disableLogging: (state) => {
    state.loggingEnabled = false
  },
  setJobs: (state, { jobs }) => {
    state.jobs = jobs
  },
  setNotificationsSocket: (state, socket) => {
    state.socket = socket
  },
  setNotificationsRegistered: (state) => {
    state.socket.registered = true;
  },
  notifications: (state, notifications) => {
    state.notifications = notifications;
  }
}
