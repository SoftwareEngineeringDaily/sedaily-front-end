<template>
	<div class="home-container">
		<feed-grid :posts="displayedPosts" :loading="loading"/>
	</div>
</template>


<script>
import FeedGrid from '@/components/feed/FeedGrid'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
	name: 'home-section',
	components: { FeedGrid },
	created() {
	    this.fetchPosts()
	},
	data() {
	    return {
	      loading: true,
	      displayedPosts: []
	    }
	},
	methods: {
	    ...mapActions(['getPosts']),
	    fetchPosts() {
	      this.getPosts({}).then(
	        data => {
	          this.displayedPosts = data.posts
	          this.loading = false
	          this.$store.commit('setPosts', {posts: data.posts})
	        }
	      )
	    },
	}
}
</script>

<style lang="stylus" scoped>
.home-container 
	max-width 1050px
	margin 0 auto
</style>