<template>
	<div class="related-container">
		<h6 class="section-title">Related Episodes</h6>
		<div class="recommended-grid">
			<post-preview 
				v-for="post in posts" 
				:key="post._id" 
				:post="post" 
				:showImg="false"
				:showTags="false"/>
		</div>
	</div>
</template>

<script>
import PostPreview from './PostPreview'
export default {
	components: { PostPreview },
	computed: {
		posts () {
			const store_posts = this.$store.state.posts
			return Object.keys(store_posts).map(post=> {
				console.log(store_posts[post])
				return store_posts[post]
			}).splice(0,2)
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
	@media (min-width: 900px) 
		grid-template-columns repeat(2, 1fr)
		grid-column-gap 30px
		grid-row-gap 24px
</style>