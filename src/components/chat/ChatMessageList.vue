<template>
  <div class="chat-history">
      <chat-message v-for="message in messages" :key="message.id" :message="message" />
	</div> <!-- end chat-history -->
</template>

<script>
import ChatMessage from 'components/chat/ChatMessage'

export default {
  name: 'chat-message-list',
  props: {
    messages: {
      type: Array,
      default: () => []
    }
  },
  components: {
    ChatMessage
  },
  methods: {
    scrollToBottom () {
      this.$nextTick(() => {
        const messagesList = this.$el
        messagesList.scrollTop = messagesList.scrollHeight
      })
    }
  },
  watch: {
    messages () {
      this.messages.length && this.scrollToBottom()
    }
  }
}
</script>

<style scoped lang="stylus">
.chat-history
  height 325px
  padding 8px 24px
  overflow-y scroll

</style>

