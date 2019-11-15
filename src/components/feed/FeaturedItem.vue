<template>
	<div class="featured-section">
		<h5>Featured News</h5>
		<div class="featured-post">
			<div class="img-container">
				<img :src="featuredItem.img"/>
			</div>
			<div class="body-container">
				<post-details :post="featuredItem" />
			</div>
		</div>
	</div>
</template>


<script>
import PostDetails from '@/components/post/PostPreview/PostPreviewCopy'

const item = {
	img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
	tags: ["podcast","facebook","social media"],
	title: "Facebook Entrepreneurship with Jeff Rothschild",
	description: "Here is a description",
	date: "October 25th, 2019",
	duration: "40 mins",
	commentCount: 5
}

export default {
	name: "featured-item",
	components: { PostDetails },
	props: {
		featuredItem: {
	      type: Object,
	      required: true,
	      default: item
	    }
	}
}
</script>

<style lang="stylus" scoped>
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









