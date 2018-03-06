<template>
  <form @submit.prevent>
    <fieldset>
      <input
        v-model="body"
        :disabled="!isChatOnline"
        type="text"
        placeholder="Type your message…"
        autofocus
        @keyup.enter="addMessage">
    </fieldset>
  </form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    body: ''
  }),
  computed: {
    ...mapGetters([
      'isChatOnline'
    ])
  },
  methods: {
    ...mapActions([
      'sendChatMessage'
    ]),
    addMessage: function (e) {
      const { username, name } = this.user
      const message = {
        username,
        name,
        sent_at: new Date(), // eslint-disable-line camelcase
        body: this.body
      }
      this.body = ''
      this.sendChatMessage(message)
    }

  }
}
</script>

<style scoped lang="stylus">
fieldset
  border 0
  margin 0
  padding 0

form
  padding 24px

input
  border 0
  color inherit
  font-family inherit
  font-size 100%
  line-height normal
  margin 0

input[type="text"]
  border 1px solid #ccc
  border-radius 3px
  padding 8px
  outline none
  width 274px

input:disabled
  background-color #ececec
</style>

