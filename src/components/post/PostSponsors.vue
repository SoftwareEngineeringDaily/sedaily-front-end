<template>
	<div class="sponsors">
		<h6 class="section-title">Sponsors</h6>
		<div v-html="post.sponsorsContent" />
	</div>
</template>


<script>
export default {
	name: "post-sponsors",
	props: {
		post: {
	      type: Object,
	      required: true
	    }
	}
}
</script>

<style lang="stylus" scoped>
.sponsors
	margin 50px 0
	
</style>