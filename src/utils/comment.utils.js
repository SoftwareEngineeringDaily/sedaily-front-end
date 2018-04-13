import Vue from 'vue'

export function parseIdsIntoComments ({ entityParentCommentIds, commentsMap }) {
  const parentComments = entityParentCommentIds.map(id => {
    // Important that we clone our object so we dont modify replies in original:
    const comment = Object.assign({}, commentsMap[id])
    // Replace reply ids list with actual replies:
    if (!comment.replies) return comment
    const replyComments = comment.replies.map(replyId => {
      const reply = commentsMap[replyId]
      return reply
    })
    comment.replies = replyComments
    return comment
  })
  return parentComments
}// Lets get parentCommentIds

export function repliesToIds ({ state, replies }) {
  if (!replies) return []
  // This means replies is already array of ids:
  if (replies.length >= 0 && typeof replies[0] === 'string') return replies
  replies.forEach(reply => {
    if (reply) {
      Vue.set(state.comments, reply._id, reply)
    }
  })
  // Set replies to ids list:
  const replyIds = replies.map((entity) => entity._id)
  return replyIds
}
