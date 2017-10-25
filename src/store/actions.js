import authActions from './actions/auth.actions'
import postActions from './actions/posts.actions'
import commentActions from './actions/comments.actions'

export default {
  ...authActions,
  ...commentActions,
  ...postActions
}
