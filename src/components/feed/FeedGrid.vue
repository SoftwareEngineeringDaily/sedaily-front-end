<template>
	<div>
		<h5>Latest Stories</h5>
		<div class="grid">
			<div v-for="(post, i) in posts.slice(0,5)" :key="i">
				<post-preview :post="post" :inverse="i%2!=0"/>
			</div>
			<feed-popular 
				:posts="posts.slice(0,4)"
				sectionTitle="Popular Stories" />
			<div v-for="(post, i) in posts.slice(5,10)" :key="i">
				<post-preview :post="post" :inverse="i%2!=0"/>
			</div>
			<feed-popular 
				inverse
				:posts="posts.slice(0,4)"
				sectionTitle="Recommended Stories" />
		</div>
	</div>
</template>


<script>
import PostPreview from '@/components/post/PostPreview'
import FeedPopular from '@/components/feed/FeedPopular'
const posts = [
	{
	img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
	tags: ["podcast","facebook","social media"],
	title: "Facebook Entrepreneurship with Jeff Rothschild",
	description: "Here is a description",
	date: "October 25th, 2019",
	duration: "40 mins",
	commentCount: 5
	},
	{
		img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
		tags: ["podcast","facebook","social media"],
		title: "Facebook Entrepreneurship with Jeff Rothschild",
		description: "Here is a description",
		date: "October 25th, 2019",
		duration: "40 mins",
		commentCount: 5
	},
	{
		img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
		tags: ["podcast","facebook","social media"],
		title: "Facebook Entrepreneurship with Jeff Rothschild",
		description: "Here is a description",
		date: "October 25th, 2019",
		duration: "40 mins",
		commentCount: 5
	},
	{
		img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
		tags: ["podcast","facebook","social media"],
		title: "Facebook Entrepreneurship with Jeff Rothschild",
		description: "Here is a description",
		date: "October 25th, 2019",
		duration: "40 mins",
		commentCount: 5
	},
	{
		img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
		tags: ["podcast","facebook","social media"],
		title: "Facebook Entrepreneurship with Jeff Rothschild",
		description: "Here is a description",
		date: "October 25th, 2019",
		duration: "40 mins",
		commentCount: 5
	},
	{
		img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
		tags: ["podcast","facebook","social media"],
		title: "Facebook Entrepreneurship with Jeff Rothschild",
		description: "Here is a description",
		date: "October 25th, 2019",
		duration: "40 mins",
		commentCount: 5
	},
	{
		img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
		tags: ["podcast","facebook","social media"],
		title: "Facebook Entrepreneurship with Jeff Rothschild",
		description: "Here is a description",
		date: "October 25th, 2019",
		duration: "40 mins",
		commentCount: 5
	},
	{
		img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
		tags: ["podcast","facebook","social media"],
		title: "Facebook Entrepreneurship with Jeff Rothschild",
		description: "Here is a description",
		date: "October 25th, 2019",
		duration: "40 mins",
		commentCount: 5
	},
	{
		img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
		tags: ["podcast","facebook","social media"],
		title: "Facebook Entrepreneurship with Jeff Rothschild",
		description: "Here is a description",
		date: "October 25th, 2019",
		duration: "40 mins",
		commentCount: 5
	},
	{
		img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
		tags: ["podcast","facebook","social media"],
		title: "Facebook Entrepreneurship with Jeff Rothschild",
		description: "Here is a description",
		date: "October 25th, 2019",
		duration: "40 mins",
		commentCount: 5
	}
]
export default {
	name: "featured-grid",
	components: { PostPreview, FeedPopular },
	props: {
		posts: {
	      type: Array,
	      default: function () { return posts }
	    }
	}
}
</script>

<style lang="stylus" scoped>
.grid 
	display grid
	grid-template-columns auto
	grid-auto-rows 1fr
	grid-column-gap 30px
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
			background #222
	
</style>