import { PlayerState } from './../utils/playerState'

export default {
  playerState: PlayerState.STOPPED,
  activePlayerPost: { title: {}},
  activeType: null,
  posts: {},
  postComments: {},
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
  loggingEnabled: true,
  token: localStorage.getItem('token')
}
