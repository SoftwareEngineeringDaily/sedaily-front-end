<!-- Related Episodes  -->

<template>
	<div class="related-container" v-if="post">
		<h6 class="section-title">Related Episodes</h6>
		<div class="recommended-grid">
			<post-preview 
				v-for="post in posts" 
				:key="post._id" 
				:post="post" 
				:isPreview="false"
				:showGuest="false"
				:showImg="false"
				:showTags="false"/>
		</div>
	</div>
</template>

<script>
import PostPreview from './PostPreview'
export default {
	components: { PostPreview },
	props: {
		post: {
	      type: Object,
	      required: true,
	    }
	},
	computed: {
		posts: {
			get: function () {
				let post = this.post
				const store_posts = this.$store.state.posts
				const posts = Object.keys(store_posts).map(post=>{return (store_posts[post])})
				posts.sort((a, b) => (0.5 - Math.random()))
				return posts.splice(0,2)
			}
	    }
	}
}
</script>

<style lang="stylus" scoped>
.recommended-grid 
	display grid
	grid-template-columns auto
	grid-auto-rows 1fr
	grid-column-gap 10px
	grid-row-gap 24px
	overflow hidden
	@media (min-width: 900px) 
		grid-template-columns repeat(2, auto)
		grid-column-gap 30px
		grid-row-gap 24px
	
</style>