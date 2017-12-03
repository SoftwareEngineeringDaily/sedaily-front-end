<template>
  <div>
		<div class="chat-message clearfix">
					<img src="https://scontent-lax3-2.xx.fbcdn.net/v/t1.0-1/p40x40/20638887_10208675220992306_8291799041169735554_n.jpg?oh=1bc2af73938c635331d20fe1a6659032&oe=5A97CFB9" alt="" width="32" height="32">
					<div class="chat-message-content clearfix">
						<span class="chat-time">{{this.formatDate(message.sent_at)}}</span>
						<h5>{{message.name}}</h5>
						<p>{{message.body}}</p>
					</div> <!-- end chat-message-content -->
		</div> <!-- end chat-message -->
		<hr>
  </div>
</template>

<script>
export default {
  name: 'chat-message',
  props: [
    'message'
  ],
  methods: {
    formatDate: (date) => {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }
}
</script>

<style scoped>
h5 {
  font-size: 10px;
  font-weight: bold;
}

h4,
h5 {
  line-height: 1.5em;
  margin: 0;
}
.chat-message {
  margin: 16px 0;
}

.chat-message img {
  border-radius: 50%;
  float: left;
}

.chat-message-content {
  margin-left: 50px;
}

.chat-time {
  float: right;
  font-size: 10px;
}
</style>

