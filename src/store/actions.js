import authActions from './actions/auth.actions'
import userActions from './actions/user.actions'
import postActions from './actions/posts.actions'
import commentActions from './actions/comments.actions'

export default {
  ...authActions,
  ...userActions,
  ...commentActions,
  ...postActions
}
