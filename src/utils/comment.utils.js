export function parseIdsIntoComments ({ entityParentCommentIds, commentsMap }) {
  const parentComments = entityParentCommentIds.map(id => {
    const comment = commentsMap[id]
    // Replace reply ids list with actual replies:
    const replyComments = comment.replies.map(replyId => {
      const reply = commentsMap[replyId]
      return reply
    })
    comment.replies = replyComments
    return comment
  })
  return parentComments
}// Lets get parentCommentIds
