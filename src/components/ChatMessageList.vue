<template>
  <div class="chat-history">
      <div v-for="message in messages">
        <chat-message :message="message" />
      </div>
	</div> <!-- end chat-history -->
</template>



<script>
/* @flow */
import { mapState } from 'vuex'
import ChatMessage from './ChatMessage'

export default {
  name: 'chat-message-list',
  computed: mapState({
    messages: state => state.chat.messages
  }),
  components: {
    ChatMessage
  }
}
</script>

<style scoped>
.chat-history {
  height: 325px;
  padding: 8px 24px;
  overflow-y: scroll;
}
</style>

