<template>
	<div class="tags" :class="[inverse ? 'inverse' : '']">
		<span v-for="topic in postTopics" :key="topic.id">{{ topic }}</span>
	</div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'

export default {
	props: {
		post: {
	      type: Object,
	      required: true
	    },
	    inverse: {
	    	type: Boolean
	    }
	},
	data () {
		return {
		  postTopics: [],
		}
	},

	async mounted () {
		const topicsResponse =  await this.getPostTopics({ postId: this.post._id })
 	 	this.postTopics = topicsResponse.data.map(item => item.name)

	},
	methods: {
    	...mapActions([ 'getPostTopics' ]),
	}
}
</script>

<style lang="stylus" scoped>
.tags
	display block
	font-size .7rem
	span
		user-select none
		display inline-block
		margin 0 10px 10px 0
		text-transform uppercase
		color #fff
		background-color #222
		border-radius 2px
		padding 4px 12px
	&.inverse
		span
			color #222
			background-color #fff


</style>
