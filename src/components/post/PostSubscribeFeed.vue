<template>
	<div class="subscribe-section">
		<div>Subscribe:</div>
		<div><b>Apple Podcast</b></div><span>|</span>
		<div><b>Android</b></div><span>|</span>
		<div><b>RSS</b></div>
	</div>
</template>


<script>
export default {
	props: {
		post: {
	      type: Object,
	      required: true
	    }
	}
}
</script>

<style lang="stylus" scoped>
.subscribe-section
	margin-top 15px
	text-transform uppercase
	font-size .8rem
	display flex
	&.bold
		font-weight bold
	> *
		margin-right 15px
	
</style>