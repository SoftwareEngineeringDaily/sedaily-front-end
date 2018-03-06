<template>
  <div class="chat-history">
    <chat-message
      v-for="message in messages"
      :key="message.id"
      :message="message" />
  </div>
</template>

<script>
/* @flow */
import ChatMessage from './ChatMessage'

export default {
  components: {
    ChatMessage
  },
  props: {
    messages: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    messages () {
      this.messages.length && this.scrollToBottom()
    }
  },
  methods: {
    scrollToBottom () {
      this.$nextTick(() => {
        const messagesList = this.$el
        messagesList.scrollTop = messagesList.scrollHeight
      })
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

