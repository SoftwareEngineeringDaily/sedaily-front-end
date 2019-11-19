<template>
	<div>
		<featured-item :post="posts[0]"/>
		<h5>Latest Stories</h5>
		<div class="grid">
			<div v-for="(post, i) in posts.slice(1,6)" :key="i">
				<post-preview :post="post" :inverse="((i+1)%4==2||(i+1)%4==3)"/>
			</div>
			<feed-popular 
				inverse
				:postCount="6"
				sectionTitle="Popular Stories" />
			<div v-for="(post, i) in posts.slice(6,11)" :key="i">
				<post-preview :post="post" :inverse="i==0||((i-1)%4==2||(i-1)%4==3)"/>
			</div>
			<feed-popular 
				inverse
				:postCount="6"
				sectionTitle="Recommended Stories" />
		</div>
	</div>
</template>

<script>
import FeaturedItem from './FeaturedItem'
import PostPreview from '@/components/post/PostPreview'
import FeedPopular from './FeedPopular'
import { mapActions } from 'vuex'

export default {
	components: { PostPreview, FeedPopular , FeaturedItem },
	
	props: {
		posts: Array
	}
}
</script>

<style lang="stylus" scoped>
h5
	text-transform uppercase
	font-size .8rem
	font-weight 700
.grid 
	display grid
	grid-template-columns auto
	grid-auto-rows 1fr
	grid-column-gap 10px
	grid-row-gap 24px
	padding-bottom 150px
	@media (min-width: 900px) 
		grid-template-columns repeat(2, 1fr)
		grid-column-gap 30px
		grid-row-gap 24px
	> div
		position relative
	:nth-child(2)
		.body-container
			background #222 !important
	
</style>