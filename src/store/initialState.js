import { PlayerState } from './../utils/playerState'

export default {
  playerState: PlayerState.STOPPED,
  activePlayerPost: { title: {}},
  activeType: null,
  posts: {},
  entityComments: {}, // arrays of ids, only root comments
  comments: {}, // Map of all comments, key is comment._id
  postRelatedLinks: {},
  feed: [],
  placeholderAvatar: 'https://s3-us-west-2.amazonaws.com/sd-profile-pictures/profile-icon-9.png',
  me: {},
  users: {},
  lists: {
    top: [],
    new: [],
    recommendation: []
  },
  chat: {
    settings: {
      displayBox: false
    },
    online: false,
    messages: []
  },
  token: localStorage.getItem('token'),
  loggingEnabled: true,
  jobs: [],
  forumThreadIdsList: [],
  forumThreads: {}
}
