<template>
  <div>
    <div class="chat-message clearfix">
      <img
        src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y"
        alt=""
        width="32"
        height="32">
      <div class="chat-message-content clearfix">
        <span class="chat-time">{{ formatDate(message.sent_at) }}</span>
        <h5>{{ message.user.name }}</h5>
        <p>{{ message.body }}</p>
      </div>
    </div>
    <hr>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDate: (date) => {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }
}
</script>

<style scoped lang="stylus">
h5
  font-size 10px
  font-weight bold

h4,
h5 {
  line-height: 1.5em;
  margin: 0;
}
.chat-message
  margin 16px 0
  overflow-wrap break-word
  word-wrap break-word

  /* Adds a hyphen where the word breaks */
  -webkit-hyphens auto
  -ms-hyphens auto
  -moz-hyphens auto
  hyphens auto
}

.chat-message img
  border-radius 50%
  float left

.chat-message-content
  margin-left 50px

.chat-time
  float right
  font-size 10px

</style>
