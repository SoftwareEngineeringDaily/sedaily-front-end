<template>
  <div class="chat-history">
        <chat-message />
        <chat-message />
        <chat-message />
        <chat-message />
        <chat-message />
        <chat-message />
        <chat-message />
	</div> <!-- end chat-history -->
</template>



<script>
/* @flow */
import ChatMessage from './ChatMessage'

export default {
  name: 'chat-message-list',
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

