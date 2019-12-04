<template>
	<div class="sponsors" v-if="post.sponsorsContent">
		<h6 class="section-title">Sponsors</h6>
		<div v-html="post.sponsorsContent" class="sponsors-section"/>
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

<style lang="stylus">
.sponsors
	margin 50px 0
	display block
	.sponsors-section 
		position relative
	.row:first-child
		align-items center
		justify-content center
		display flex
	


	
</style>