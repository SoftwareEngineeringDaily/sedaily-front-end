<template>
  <div>
		<div class="chat-message clearfix">
					<img src="https://scontent-lax3-2.xx.fbcdn.net/v/t1.0-1/p40x40/20638887_10208675220992306_8291799041169735554_n.jpg?oh=1bc2af73938c635331d20fe1a6659032&oe=5A97CFB9" alt="" width="32" height="32">
					<div class="chat-message-content clearfix">
						<span class="chat-time">11:35pm</span>
						<h5>Edgar Pino</h5>
						<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error, explicabo quasi ratione odio dolorum harum.</p>
					</div> <!-- end chat-message-content -->
		</div> <!-- end chat-message -->
		<hr>
  </div>
</template>



<script>
/* @flow */
export default {
  name: 'chat-message'
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

