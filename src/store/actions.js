import authActions from './actions/auth'
import postActions from './actions/posts'
import commentActions from './actions/comments'

export default {
  ...authActions,
  ...commentActions,
  ...postActions
}
