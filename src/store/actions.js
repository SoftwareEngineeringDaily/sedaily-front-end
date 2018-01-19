import authActions from './actions/auth.actions'
import userActions from './actions/user.actions'
import postActions from './actions/posts.actions'
import commentActions from './actions/comments.actions'
import relatedLinksActions from './actions/relatedLinks.actions'
import playerActions from './actions/player.actions'
import feedActions from './actions/feed.actions'
import subscriptionActions from './actions/subscription.actions'

export default {
  ...authActions,
  ...userActions,
  ...commentActions,
  ...relatedLinksActions,
  ...playerActions,
  ...postActions,
  ...subscriptionActions,
  ...feedActions
}
