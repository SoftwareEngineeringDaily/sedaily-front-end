import authActions from './actions/auth.actions'
import userActions from './actions/user.actions'
import postActions from './actions/posts.actions'
import commentActions from './actions/comments.actions'
import relatedLinksActions from './actions/relatedLinks.actions'
import playerActions from './actions/player.actions'
import chatActions from './actions/chat.actions'
import loggingPostActions from './actions/logging.post.actions'
import jobActions from './actions/job.actions'
import companyActions from './actions/company.actions'

export default {
  ...authActions,
  ...companyActions,
  ...userActions,
  ...commentActions,
  ...relatedLinksActions,
  ...playerActions,
  ...postActions,
  ...chatActions,
  ...loggingPostActions,
  ...jobActions
}
