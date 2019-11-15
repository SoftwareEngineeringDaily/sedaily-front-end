<template>
	<div class="body" :class="[inverse ? 'inverse' : '']">
		<div class="tags">
			<span>podcast</span>
			<span>facebook</span>
			<span>social media</span>
		</div>
		<h3 class="title">
			{{post.title}}
		</h3>
		<div class="copy">
			{{post.description}}
		</div>
		<div class="post-details">
			<div class="date">{{post.date}}</div><span>|</span>
			<div class="duration">40 mins</div><span>|</span>
			<div class="comment-count">5 comments</div>
		</div>
		<div class="author">
			Posted by Jeff Myerson
		</div>
	</div>
</template>


<script>
export default {
	name: "post-preview-copy",
	props: {
		post: {
	      type: Object,
	      required: true
	    },
	    inverse: {
	    	type: Boolean
	    }
	}
}
</script>

<style lang="stylus" scoped>
.body
	padding 3.125rem .8rem
	@media (max-width 599px)	
		padding: 2rem .8rem;
	.post-details
		display flex
		font-weight bold
		> *
			margin-right 15px
	.title 
		font-size 2.2rem
	.tags 
		display block
		margin 10px 0 20px 0
		font-size 13px
		span
			margin 0 10px 10px 0
			text-transform uppercase
			user-select none
			color #fff
			background-color #222
			border-radius 2px
			padding 6px 12px
			display inline-block
	&.inverse
		color #fff
		.tags
			span
				background-color #fff
				color #222
</style>