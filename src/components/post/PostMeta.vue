<template>
	<div class="post-details" :class="{bold : isPreview}">
		<div class="date">{{ publicationDate }}</div>
		<span v-if="showDuration">|</span><div v-if="showDuration" class="duration">40 mins</div>
		<span>|</span>
		<div class="comment-count">{{post.thread.commentsCount}} comments</div>
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
	    }
	},
	computed: {
		publicationDate () {
	      if (this.post) {
	        return moment(this.post.date).format('MMMM Do')
	      }
	    },
	}
}
</script>

<style lang="stylus" scoped>
.post-details
	display flex
	&.bold
		font-weight bold
	> *
		margin-right 10px
</style>