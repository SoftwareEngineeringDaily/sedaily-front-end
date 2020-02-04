<template>
	<div class="post-details" :class="{ bold :isPreview }">
		<div class="date">{{ publicationDate }}</div>
		<span v-if="showDuration">|</span>
    <div v-if="showDuration" class="duration">40 mins</div>
		<span>|</span>
		<div v-if="post.thread" class="comment-count">{{post.thread.commentsCount}} comments</div>
    <div v-else class="comment-count">0 comments</div>
	</div>
</template>


<script>
import moment from 'moment'
export default {
	name: "post-meta",
	props: {
		post: {
      type: Object,
      required: true
    },
    isPreview: {
    	type: Boolean,
    	default: false
    },
    showDuration: {
    	type: Boolean,
    	default: true
    },
	},
	computed: {
		publicationDate () {
      let format = this.isPreview ? 'MMM Do' : 'MMMM Do, YYYY'
      if (this.post) {
        return moment(this.post.date).format(format)
      }
    },
	}
}
</script>

<style>
.post-details {
  display: flex;
  font-size: 0.8rem;
  letter-spacing: 0.6px;
  font-weight: 600;
  text-transform: uppercase;
}

.post-details > * {
  margin-right: 10px;
}
</style>
