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
