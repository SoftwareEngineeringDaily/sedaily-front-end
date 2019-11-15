<template>
	<div class="body">
		<featured-item/>
		<feed-grid/>
	</div>
</template>


<script>
import FeaturedItem from '@/components/feed/FeaturedItem'
import FeedGrid from '@/components/feed/FeedGrid'
export default {
	name: "home-section",
	components: { FeaturedItem, FeedGrid },
	props: {

	}
}
</script>

<style lang="stylus" scoped>
.body 
	min-height 80vh
</style>