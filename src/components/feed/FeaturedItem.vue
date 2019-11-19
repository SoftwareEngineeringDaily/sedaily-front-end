<template>
	<div class="featured-section">
		<h5>Featured News</h5>
		<div class="featured-post">
			<div class="img-container">
				<img :src="post.featuredImage"/>
			</div>
			<div class="body-container">
				<post-details :post="post" />
			</div>
		</div>
	</div>
</template>


<script>
import PostDetails from '@/components/post/PostPreview/PostPreviewCopy'

export default {
	name: "featured-item",
	components: { PostDetails },
	props: {
		post: {
	      type: Object,
	      required: true,
	    }
	}
}
</script>

<style lang="stylus" scoped>
h5
	text-transform uppercase
	font-size .8rem
	font-weight 700
.featured-section
	margin 50px 0
.featured-post
	@media (min-width 900px)
		justify-content space-between
		display flex
	    flex-direction row
	    align-items center
	.img-container 
		margin 0 auto
		width 100%
		justify-content flex-start
		@media (min-width 900px)
			flex-basis 50%
		img 
			width 100%
	.body-container
		@media (min-width 900px)
			text-align: left;
			flex-basis: 50%;
			padding-left: 5rem

</style>









