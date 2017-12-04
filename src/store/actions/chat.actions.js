import { joinChatChannel } from '../../channel'

let lobbyChatChannel = null

export default {
  connectToChatChannel ({ getters }) {
    const token = getters.getToken
    lobbyChatChannel = joinChatChannel({ token })
  },
  sendChatMessage ({ commit }, message) {
    lobbyChatChannel.push('create_chat_message', message)
  }
}
