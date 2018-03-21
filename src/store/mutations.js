import Vue from 'vue'
import find from 'lodash/find'

export default {

  setActivePostInPlayer: (state, { post }) => {
    state.activePlayerPost = post
  },

  updatePlayerState: (state, playerState) => {
    state.playerState = playerState
  },

  setActiveType: (state, { type }) => {
    state.activeType = type
  },

  setMe: (state, { me }) => {
    state.me = me
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
    state.entityComments[comment.entityId].unshift(comment)
  },*/
  setCompanies: (state, { companies }) => {
    Vue.set(state, 'companies', companies)
  },

  setComments: (state, { comments, entityId }) => {
    comments.forEach(comment => {
      if (comment) {
        Vue.set(state.comments, comment._id, comment)
        if (!comment.replies) return
        // Loop to get replies:
        comment.replies.forEach(reply => {
          if (reply) {
            Vue.set(state.comments, reply._id, reply)
          }
        })
        // Set replies to ids list:
        const replyIds = comment.replies.map((entity) => entity._id)
        comment.replies = replyIds
      }
    })
    const ids = comments.map((entity) => entity._id)
    //  Only set top level comments:
    Vue.set(state.entityComments, entityId, ids)
  },

  setRelatedLinks: (state, { relatedLinks, postId }) => {
    Vue.set(state.postRelatedLinks, postId, relatedLinks)
  },

  setFeedItems: (state, { feedItems }) => {
    state.feed = feedItems
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
    console.log('ids', ids)
    Vue.set(state, 'forumThreadIdsList', ids)
  },

  setPosts: (state, { posts }) => {
    posts.forEach(post => {
      if (post) {
        Vue.set(state.posts, post._id, post)
      }
    })
  },

  // TODO: This is a bit uggly, will need to refactor:
  likeComment: (state, { commentId, entityId, parentCommentId }) => {
    let incrementValue = 1
    // First let's find our comment:
    let entity

    const parentComments = state.entityComments[entityId]
    // Weird error if this is not defiend:
    if (!parentComments) return
    if (!parentCommentId) {
      // We are a root level comment so it's easy
      entity = find(parentComments, (comment) => {
        return comment._id === commentId
      })
      if (!entity) return
    } else {
      // First we need to find our parent:
      const parentComment = find(parentComments, (comment) => {
        return comment._id === parentCommentId
      })
      if (!parentComment) return
      // Now we can find our actual comment:
      entity = find(parentComment.replies, (comment) => {
        return comment._id === commentId
      })
      if (!entity) return
    }

    if (entity.downvoted) incrementValue += 1

    if (entity.upvoted) {
      entity.score -= incrementValue
    } else {
      entity.score += incrementValue
    }
    entity.upvoted = !entity.upvoted
    entity.downvoted = false
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

    if (state.posts[articleId].downvoted) incrementValue += 1

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

    if (state.posts[articleId].upvoted) incrementValue += 1

    if (state.posts[articleId].downvoted) {
      state.posts[articleId].score += incrementValue
    } else {
      state.posts[articleId].score -= incrementValue
    }
    state.posts[articleId].upvoted = false
    state.posts[articleId].downvoted = !state.posts[articleId].downvoted
  },

  setToken: (state, { token }) => {
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
  }
}
