<template>
  <div v-bind:class="{ online: isChatOnline, 'chat-wrapper': true }">
		<header @click='toggleChatBox' class="clearfix" >
			<a class="chat-close">{{ isChatBoxDisplayed ? '-' : '+' }}</a>
			<h4>{{me.name}}</h4>
			<span class="chat-message-counter">3</span>
		</header>
		<div v-bind:class="{ active: isChatBoxDisplayed, 'chat-box': true }">
      <chat-message-list />
			<chat-add-form :user="me"/>
		</div> <!-- end chat -->
	</div> <!-- end live-chat -->
</template>

<script>
import ChatMessageList from './ChatMessageList'
import ChatAddForm from './ChatAddForm'
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  name: 'chat-box',
  components: {
    ChatMessageList,
    ChatAddForm
  },
  methods: {
    ...mapActions([
      'fetchMyProfileData',
      'connectToChatChannel'
    ]),
    toggleChatBox: function (e) {
      this.$store.commit('toggleChatWindow')
    }
  },
  async beforeMount () {
    await this.fetchMyProfileData()
    await this.connectToChatChannel()
  },
  computed: {
    ...mapState({
      me (state) {
        return state.me
      }
    }),
    ...mapGetters([
      'isChatBoxDisplayed',
      'isChatOnline'
    ]),
    chat: function chat () {
      return this.$store.state.chat
    }
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
}

fieldset {
  border: 0;
  margin: 0;
  padding: 0;
}

h4,
h5 {
  line-height: 1.5em;
  margin: 0;
}

hr {
  background: #e9e9e9;
  border: 0;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
  height: 1px;
  margin: 0;
  min-height: 1px;
}

img {
  border: 0;
  display: block;
  height: auto;
  max-width: 100%;
}

p {
  margin: 0;
}

.clearfix {
  *zoom: 1;
} /* For IE 6/7 */
.clearfix:before,
.clearfix:after {
  content: "";
  display: table;
}
.clearfix:after {
  clear: both;
}

.chat-wrapper {
  bottom: 0;
  font-size: 12px;
  right: 24px;
  position: fixed;
  width: 325px;
}
.chat-wrapper header {
  background: #3f58af;
  border-radius: 5px 5px 0 0;
  color: #fff;
  cursor: pointer;
  padding: 16px 24px;
}
.chat-wrapper.online h4:before {
  background: #1a8a34;
}

.chat-wrapper h4:before {
  background: #ca3535;
  border-radius: 50%;
  content: "";
  display: inline-block;
  height: 8px;
  margin: 0 8px 0 0;
  width: 8px;
}
.chat-wrapper h4 {
  font-size: 12px;
}

.chat-wrapper h5 {
  font-size: 10px;
}

.chat-message-counter {
  background: #e62727;
  border: 1px solid #fff;
  border-radius: 50%;
  display: none;
  font-size: 12px;
  font-weight: bold;
  height: 28px;
  left: 0;
  line-height: 28px;
  margin: -15px 0 0 -15px;
  position: absolute;
  text-align: center;
  top: 0;
  width: 28px;
}

.chat-close {
  background: #1b2126;
  border-radius: 50%;
  color: #fff;
  display: block;
  float: right;
  font-size: 10px;
  height: 16px;
  line-height: 16px;
  margin: 2px 0 0 0;
  text-align: center;
  width: 16px;
}

.chat-box {
  background: #fff;
  display: none;
}

.chat-box.active {
  display: block;
}
</style>

