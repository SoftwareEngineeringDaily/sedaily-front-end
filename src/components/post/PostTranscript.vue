<template>
	<div class="transcript-section" v-if="post.transcript" :class="[isCollapsed ? 'collapsed' : '']" v-on:click="openTranscript">
		<h6 class="section-title">Post Transcript</h6>
		<div class="transcript-embed">
		{{ post.transcript }}
		</div>
	</div>
</template>


<script>
export default {
	name: "post-transcript",
	props: {
		post: {
	      type: Object,
	      required: true
	    }
	},
	data() {
	    return {
	      isCollapsed: true
	    }
	},
	methods: {
		openTranscript() {
			this.isCollapsed = false
		}
	}
}
</script>

<style lang="stylus" scoped>
.transcript-section
	font-size 1.1rem
	color #222
	position relative
	margin-bottom 55px
	display flex
	flex-direction column
	p
		margin-bottom 25px
		.transcript-header
			font-size 15px
			display block
			margin-bottom 10px
			font-weight bold
			.transcript-time
				font-weight 400
				font-size .9rem
				background-color #dee2e6
				border-radius 2px
				margin-right 10px
				color #222
				cursor pointer
				padding 3px 6px
	&.collapsed
		cursor pointer
		height 400px
		overflow hidden
		&:after 
			background-image linear-gradient(
			    to bottom,
			    rgba(255, 255, 255, 0) 0%,
			    rgb(255, 255, 255) 100%
			)
			bottom -20px
			content ""
			height 400px
			left -20px
			position absolute
			width calc(100% + 40px)
			cursor pointer
		&:hover
			&:before
				background-color #a591ff
				transform scale(1.02)
		&:before 
			align-self center
			background-color #222
			border-radius 3px
			bottom 24px
			color #fff
			content "View Transcript"
			font-size 15px
			font-weight 500
			padding 10px 20px
			position absolute
			text-align center
			text-transform uppercase
			transition all .2s
			z-index 10000
		
</style>