<template>
  <form @submit.prevent>
				<fieldset>
					<input @keyup.enter="addMessage" type="text" v-model="body" placeholder="Type your message…" autofocus>
				</fieldset>
	</form>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'chat-add-form',
  props: [
    'user'
  ],
  data: () => ({
    body: ''
  }),
  methods: {
    ...mapActions([
      'sendChatMessage'
    ]),
    addMessage: function (e) {
      const { username, name } = this.user
      const message = {
        username,
        name,
        sent_at: new Date(),
        body: this.body
      }
      this.body = ''
      this.sendChatMessage(message)
    }

  }
}
</script>

<style scoped>
fieldset {
  border: 0;
  margin: 0;
  padding: 0;
}
form {
  padding: 24px;
}
input {
  border: 0;
  color: inherit;
  font-family: inherit;
  font-size: 100%;
  line-height: normal;
  margin: 0;
}
input[type="text"] {
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 8px;
  outline: none;
  width: 274px;
}
</style>

